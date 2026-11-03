-- ════════════════════════════════════════════════════════════════════════════
-- PaniniBase — sécurité (RLS) à appliquer avant la mise en ligne
-- Supabase → SQL Editor → coller ce fichier → Run. Ré-exécutable sans risque.
-- ════════════════════════════════════════════════════════════════════════════
-- Principe : la clé « anon » est publique (elle est dans le bundle JS). Toute la
-- sécurité repose donc sur les policies ci-dessous : chaque utilisateur ne peut
-- lire et modifier QUE ses propres lignes. Les lectures croisées (comparer avec
-- un ami, ouvrir une annonce par son code) passent par des fonctions dédiées.

-- ── 1. Activer RLS partout (sans RLS, n'importe qui lit/modifie toute la table) ──
alter table public.collection enable row level security;
alter table public.trades     enable row level security;
alter table public.profiles   enable row level security;

-- ── 2. collection : uniquement ses propres stickers ─────────────────────────
drop policy if exists "collection_select_own" on public.collection;
drop policy if exists "collection_insert_own" on public.collection;
drop policy if exists "collection_update_own" on public.collection;
drop policy if exists "collection_delete_own" on public.collection;
create policy "collection_select_own" on public.collection for select to authenticated using (user_id = auth.uid());
create policy "collection_insert_own" on public.collection for insert to authenticated with check (user_id = auth.uid());
create policy "collection_update_own" on public.collection for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
-- Nécessaire pour « Effacer ma collection » quand on est connecté
create policy "collection_delete_own" on public.collection for delete to authenticated using (user_id = auth.uid());

-- ── 3. trades : uniquement sa propre annonce (les autres passent par get_trade_by_token) ──
drop policy if exists "Trades readable by token" on public.trades;
drop policy if exists "trades_select_own" on public.trades;
drop policy if exists "trades_insert_own" on public.trades;
drop policy if exists "trades_update_own" on public.trades;
drop policy if exists "trades_delete_own" on public.trades;
create policy "trades_select_own" on public.trades for select to authenticated using (user_id = auth.uid());
create policy "trades_insert_own" on public.trades for insert to authenticated with check (user_id = auth.uid());
create policy "trades_update_own" on public.trades for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "trades_delete_own" on public.trades for delete to authenticated using (user_id = auth.uid());

-- ── 4. profiles : pseudos lisibles par les membres connectés, modifiables par leur propriétaire ──
drop policy if exists "Profiles are public" on public.profiles;
drop policy if exists "Profiles readable by authenticated users" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
create policy "Profiles readable by authenticated users" on public.profiles for select to authenticated using (true);
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "profiles_update_own" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
-- NB : les pseudos ne sont pas uniques (le trigger handle_new_user prend le début
-- de l'e-mail : jean@a.fr et jean@b.fr donnent « jean »). Un index unique ferait
-- échouer ces inscriptions : à traiter avec le trigger si besoin.

-- ── 5. Fonctions SECURITY DEFINER : elles contournent RLS, donc on les restreint ──
-- Par défaut Postgres donne EXECUTE à tout le monde (y compris anon) : on le retire.
revoke execute on function public.get_trade_by_token(text)    from public, anon;
revoke execute on function public.get_user_collection(uuid)   from public, anon;
grant  execute on function public.get_trade_by_token(text)    to authenticated;
grant  execute on function public.get_user_collection(uuid)   to authenticated;

-- ── 5b. Matching automatique, réécrit pour ne servir QUE l'utilisateur connecté ──
-- L'ancienne version acceptait n'importe quel identifiant (et répondait aux visiteurs
-- anonymes). Ici le paramètre est gardé pour l'appli, mais il doit valoir auth.uid() :
-- sinon la fonction ne renvoie rien. Matches = annonces des autres membres où
-- ils ont ce que je cherche ET cherchent ce que j'ai. Score = nombre d'échanges 1 contre 1.
drop function if exists public.find_trade_matches(uuid);
create function public.find_trade_matches(current_user_id uuid)
  returns table (matched_user_id uuid, username text, share_token text, they_can_give jsonb, you_can_give jsonb, match_score int)
  language sql stable security definer set search_path = public as $$
  with mine as (
    select have_stickers as h, want_stickers as w from trades
    where user_id = auth.uid() and current_user_id = auth.uid()
  ),
  pairs as (
    select t.user_id, t.share_token,
      (select coalesce(jsonb_agg(x), '[]'::jsonb) from jsonb_array_elements(t.have_stickers) x
        where exists (select 1 from mine, jsonb_array_elements(mine.w) y
                      where y->>'editionId' = x->>'editionId' and y->>'number' = x->>'number')) as give_me,
      (select coalesce(jsonb_agg(x), '[]'::jsonb) from jsonb_array_elements(t.want_stickers) x
        where exists (select 1 from mine, jsonb_array_elements(mine.h) y
                      where y->>'editionId' = x->>'editionId' and y->>'number' = x->>'number')) as i_give
    from trades t
    where t.user_id <> auth.uid() and exists (select 1 from mine)
  )
  select p.user_id, pr.username, p.share_token, p.give_me, p.i_give,
         least(jsonb_array_length(p.give_me), jsonb_array_length(p.i_give))::int
  from pairs p left join profiles pr on pr.id = p.user_id
  where jsonb_array_length(p.give_me) > 0 and jsonb_array_length(p.i_give) > 0
  order by 6 desc
  limit 20;
$$;
revoke execute on function public.find_trade_matches(uuid) from public, anon;
grant  execute on function public.find_trade_matches(uuid) to authenticated;

-- ── 6. Stockage : personne n'envoie de fichiers depuis l'appli ───────────────
drop policy if exists "Auth users can upload stickers" on storage.objects;

-- ════════════════════════════════════════════════════════════════════════════
-- Vérification : doit lister rls_enabled = true pour les 3 tables, puis les policies.
-- ════════════════════════════════════════════════════════════════════════════
select relname as table_name, relrowsecurity as rls_enabled
from pg_class where relnamespace = 'public'::regnamespace and relname in ('collection', 'trades', 'profiles');

select tablename, policyname, cmd, roles, qual, with_check
from pg_policies where schemaname = 'public' order by tablename, cmd;
