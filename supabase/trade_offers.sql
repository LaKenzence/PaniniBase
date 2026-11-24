-- ════════════════════════════════════════════════════════════════════════════
-- PaniniBase — échanges suivis à deux : proposé → accepté → fait
-- Supabase → SQL Editor → coller ce fichier → Run. Ré-exécutable sans risque.
-- ════════════════════════════════════════════════════════════════════════════
-- Un membre propose un échange à un autre (ce qu'il donne / ce qu'il reçoit).
-- L'autre accepte ou refuse. Une fois les stickers échangés en vrai, chacun
-- confirme de son côté : sa propre collection est mise à jour par l'appli
-- (personne n'écrit dans la collection d'un autre). Quand les deux ont
-- confirmé, l'échange passe à « fait ».
--
-- Les changements d'état passent par des fonctions qui vérifient qui a le droit
-- de faire quoi : aucune policy UPDATE directe sur la table.

create table if not exists public.trade_offers (
  id          uuid primary key default gen_random_uuid(),
  from_user   uuid not null references public.profiles(id) on delete cascade,
  to_user     uuid not null references public.profiles(id) on delete cascade,
  give        jsonb not null default '[]'::jsonb,  -- donné par from_user : [{ editionId, number }]
  receive     jsonb not null default '[]'::jsonb,  -- reçu par from_user
  status      text not null default 'proposed' check (status in ('proposed', 'accepted', 'declined', 'cancelled', 'done')),
  from_done   boolean not null default false,
  to_done     boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  check (from_user <> to_user),
  check (jsonb_array_length(give) + jsonb_array_length(receive) > 0)
);
create index if not exists trade_offers_from_idx on public.trade_offers (from_user);
create index if not exists trade_offers_to_idx   on public.trade_offers (to_user);

alter table public.trade_offers enable row level security;

drop policy if exists "offers_select_participants" on public.trade_offers;
drop policy if exists "offers_insert_own" on public.trade_offers;
create policy "offers_select_participants" on public.trade_offers for select to authenticated
  using (auth.uid() in (from_user, to_user));
create policy "offers_insert_own" on public.trade_offers for insert to authenticated
  with check (from_user = auth.uid() and status = 'proposed' and not from_done and not to_done);

-- Le destinataire accepte ou refuse une proposition en attente
create or replace function public.respond_trade_offer(offer_id uuid, accept boolean)
  returns void language sql security definer set search_path = public as $$
  update trade_offers
     set status = case when accept then 'accepted' else 'declined' end, updated_at = now()
   where id = offer_id and to_user = auth.uid() and status = 'proposed';
$$;

-- L'auteur annule sa proposition tant qu'elle n'est pas faite
create or replace function public.cancel_trade_offer(offer_id uuid)
  returns void language sql security definer set search_path = public as $$
  update trade_offers set status = 'cancelled', updated_at = now()
   where id = offer_id and from_user = auth.uid() and status in ('proposed', 'accepted');
$$;

-- Chacun confirme avoir fait l'échange ; « fait » quand les deux ont confirmé.
-- Renvoie true si c'est la première confirmation de cet utilisateur (l'appli met
-- alors sa collection à jour, une seule fois).
create or replace function public.confirm_trade_offer(offer_id uuid)
  returns boolean language plpgsql security definer set search_path = public as $$
declare
  changed int;
begin
  update trade_offers o
     set from_done = o.from_done or o.from_user = auth.uid(),
         to_done   = o.to_done   or o.to_user   = auth.uid(),
         updated_at = now()
   where o.id = offer_id and o.status = 'accepted'
     and ((o.from_user = auth.uid() and not o.from_done) or (o.to_user = auth.uid() and not o.to_done));
  get diagnostics changed = row_count;
  update trade_offers set status = 'done' where id = offer_id and from_done and to_done;
  return changed > 0;
end $$;

revoke execute on function public.respond_trade_offer(uuid, boolean) from public, anon;
revoke execute on function public.cancel_trade_offer(uuid) from public, anon;
revoke execute on function public.confirm_trade_offer(uuid) from public, anon;
grant  execute on function public.respond_trade_offer(uuid, boolean) to authenticated;
grant  execute on function public.cancel_trade_offer(uuid) to authenticated;
grant  execute on function public.confirm_trade_offer(uuid) to authenticated;

-- Nouvelles propositions en direct (onglet Échanges ouvert)
do $$ begin
  alter publication supabase_realtime add table public.trade_offers;
exception when duplicate_object then null; end $$;
