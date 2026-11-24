# ⚽ PaniniBase

Base de données complète des stickers Panini Coupe du Monde (1970–2026).
Gestion de collection, échanges, matching automatique, badges, auth Supabase, PWA.

---

## Stack

| Couche          | Techno                                      |
|-----------------|----------------------------------------------|
| Framework       | React 18 + TypeScript                       |
| State           | Zustand + persist                            |
| Style           | CSS variables inline (dark) + classes utilitaires |
| Icônes          | lucide-react                                 |
| Virtualisation  | @tanstack/react-virtual                     |
| Image (partage) | html2canvas                                  |
| Tests           | Vitest + @testing-library/react             |
| Erreurs prod    | @sentry/react (Error monitoring uniquement)  |
| Build           | Vite                                          |
| Auth + DB       | Supabase (PostgreSQL + Storage + Realtime)   |
| Déploiement     | Vercel                                        |

---

## Démarrage

```bash
npm install && npm run dev
# http://localhost:5173
```

> Le `.npmrc` du projet force le registre npm public (sinon un `~/.npmrc` d'entreprise peut bloquer `npm install`).

### Tests
```bash
npm test          # Vitest — 86 tests (dont : chaque texte traduit en/es, checklists Panini, propositions d'échange)
npm run test:e2e  # Playwright — parcours clés, ordinateur + mobile (utilise Edge installé)
npx tsc --noEmit  # vérification TypeScript
```

### Scripts de données (Node 18+)
```bash
node scripts/import-squads.mjs   # régénère src/data/squads/*.ts (effectifs 1970–2022)
node scripts/import-checklists.mjs Joueurs.txt [1998]  # checklists Panini → src/data/checklists/
#   [année] = album des lignes sans en-tête en tête de fichier ; les albums absents du fichier sont gardés
node scripts/scrape-panini.mjs   # ancien scraper (site source déplacé, ne marche plus tel quel)
node scripts/fetch-photos.mjs    # régénère src/data/photos.ts (photos Wikimedia)
```

> Playwright cherche Edge (`msedge`). Avec Chrome : `PW_CHANNEL=chrome npm run test:e2e`.

---

## Structure

```
src/
├── types/index.ts
├── data/
│   ├── stickers.ts              # 15 albums, 2026 complet (codes officiels), index joueurs,
│   │                             # chargement à la demande des effectifs 1970–2022
│   ├── squads.ts + squads/*.ts  # Effectifs réels 1970–2022 (générés, Fjelstul WC Database)
│   ├── checklists.ts + checklists/*.ts # Checklists officielles Panini 1970–2022, sauf 1994 (générées)
│   ├── teams.ts                 # Codes équipe → nom FR, drapeau, couleur
│   ├── photos.ts                # Photos joueurs Wikimedia (auteur + licence)
│   └── stickers.test.ts / squads.test.ts
├── store/
│   ├── index.ts                  # Auth, Collection (undo/redo, offline, realtime, favoris,
│   │                             # import validé, échange validé), Trades, UI
│   └── *.test.ts
├── hooks/
│   ├── index.ts
│   ├── useDebounce.ts + test
│   ├── useTilt.ts                # Inclinaison 3D + reflet
│   ├── useEditionData.ts         # Charge les albums à la demande, re-render à l'arrivée
│   └── useBadges.ts              # 7 badges calculés localement
├── i18n/
│   ├── index.ts                  # useT() : le texte français sert de clé, « a|b » = pluriel
│   ├── en.ts / es.ts             # Dictionnaires (un test vérifie qu'il ne manque rien)
│   └── i18n.test.ts
├── lib/
│   ├── supabase.ts               # URL/clé surchargeables par VITE_SUPABASE_URL / _ANON_KEY
│   ├── sentry.ts                 # SDK chargé à la demande, prod + VITE_SENTRY_DSN uniquement
│   ├── haptic.ts                 # Vibration de confirmation mobile
│   └── stickerList.ts            # Liste manquants/doublons en texte (plages « 1-5, MEX1-MEX3 »)
├── components/
│   ├── AuthModal.tsx
│   ├── StickerCard.tsx           # Tilt 3D léger au hover, reflet souris, shiny arc-en-ciel,
│   │                             # drapeau avec halo lumineux, pop animation
│   ├── DetailPanel.tsx           # Tilt 3D, lightbox, bouton Ajouter doré, fond dégradé
│   ├── GlobalSearch.tsx
│   ├── VirtualStickerGrid.tsx    # @tanstack/react-virtual
│   ├── Confetti.tsx
│   ├── ShortcutsHelp.tsx         # Touche "?"
│   ├── ErrorBoundary.tsx         # + Sentry
│   ├── OnboardingTour.tsx        # 6 étapes au premier lancement
│   ├── ShareCard.tsx             # Capture html2canvas
│   ├── ScanMode.tsx              # Mode scan rapide mobile plein écran
│   ├── TrophyShelf.tsx           # Étagère de badges (progression des verrouillés)
│   ├── TradeStoryCard.tsx        # Visuel story (doubles/manquants + QR code)
│   ├── QrCode.tsx                # QR code du lien d'échange
│   ├── TeamProgress.tsx          # Progression équipe par équipe d'un album
│   ├── LanguageMenu.tsx          # Choix FR / EN / ES dans l'en-tête
│   └── LegalModal.tsx            # Mentions légales + crédits photos — ⚠️ placeholders à remplir
├── views/
│   ├── HomeView.tsx              # Hero cosmique (fond 4 couches, halos, cartes flottantes,
│   │                             # étoiles), stat cards avec sous-titres, albums premium
│   ├── AlbumView.tsx             # Toolbar compacte, filtres popover, virtualisation,
│   │                             # scan rapide ⚡, partage image 📸, célébrations
│   ├── PlayerView.tsx            # Cross-éditions, favoris ❤️, fond dégradé, hover premium
│   ├── StatsView.tsx             # KPI cards avec glow, charts animés (dégradés, tooltips),
│   │                             # 7 badges, favoris
│   └── TradeView.tsx             # 4 onglets : Mon annonce / Trouver / Comparer / Matches ⚡
├── App.tsx                       # Navbar dégradée, bouton Connexion doré, lazy loading vues,
│                                  # splash, offline/sync banners, badge celebration
├── main.tsx                      # ErrorBoundary + Sentry (prod) + SW registration
├── registerSW.ts                 # Service worker registration
├── theme.ts                      # Couleurs partagées (C)
└── index.css                     # Dark theme complet + noise + halos + float animations +
                                   # btn-gold/btn-green/view-bg + sticker-shiny + media queries
public/
├── sw.js                         # Service worker PWA (cache-first assets, réseau pour Supabase)
├── logo.svg / logo-192.png / logo-512.png
└── manifest.json
e2e/app.spec.ts                   # Tests Playwright (playwright.config.ts)
supabase/security.sql             # Policies RLS + matching sécurisé (à relancer après chaque modif)
supabase/trade_offers.sql         # Table et fonctions des échanges suivis à deux
scripts/
├── import-squads.mjs             # Effectifs 1970–2022 → src/data/squads/
└── fetch-photos.mjs              # Photos Wikidata/Commons → src/data/photos.ts
vitest.config.ts
```

---

## Design system

- **Palette** : `#070C18` base · `#0D1526` card · gold `#C9A227` · green `#2ECC71` · red `#E74C3C` · blue `#3498DB`
- **Police** Inter, échelle typographique CSS vars (`--text-2xs` → `--text-4xl`)
- **Icônes** lucide-react `size={16-20}` dans les actions, `size={20}` dans la nav
- **Boutons** : `.btn-gold` (dégradé or + glow), `.btn-green`, `.btn-tactile` (scale au clic)
- **Fonds** : `.view-bg` (noise + halo bleu + base sombre) sur toutes les vues
- **Cartes** : tilt 3D léger au hover sur StickerCard, zoom + ombre sur AlbumCard et PlayerView
- **Animations** : `float-a/b/c` (cartes hero), `sticker-pop`, `sticker-shiny`, `slide-in`, `spin`, confettis
- **Responsive** : `.mobile-nav` / `.mobile-detail-sheet` / `.stats-two-col` — media query `640px`

---

## Fonctionnalités ✅

### Données
- 15 albums (1970–2026) · 2026 complet (codes Panini officiels, positions réelles)
- 1970–2022 (sauf 1994) : **checklists officielles Panini** (vrais numéros, codes « FRA 19 » en 2022), chargées à la demande ;
  poste et maillot repris des effectifs. Les collections cochées avec les anciens numéros sont converties automatiquement
- 1994 : effectifs réels + écussons, numérotation générée (checklist reçue incomplète : 330 / 444)
- Fiches joueurs reliées d'une Coupe du Monde à l'autre, même écrites autrement (« Lionel Andres Messi »,
  « Son Heung-min ») : 1 074 joueurs sur plusieurs éditions
  (numérotation générée, pas encore les codes Panini d'origine)
- Index joueurs cross-éditions (Pelé → Mbappé) + 16 stars 2026 avec `playerKey`
- Photos joueurs libres de droits (Wikimedia), auteur et licence crédités

### Auth
- Email + pseudo, profil auto-créé (trigger SQL), menu desktop/mobile, Échap pour fermer

### Collection
- Sync Supabase + **offline queue** (retry auto + bandeau) + **realtime** multi-appareils
- **Undo/Redo** (Ctrl+Z/Y, 100 actions), sélection multiple, ajout en masse par liste
- **Grille virtualisée**, recherche debouncée, filtres en popover
- **Célébrations** : équipe 100%, album 100%, badge débloqué (confettis partout)
- **Panneau détail** : tilt 3D + lightbox avec même effet + bouton Ajouter doré
- **Favoris ❤️** sur les joueurs (depuis DetailPanel ou PlayerView)
- **Copier manquants / doublons** (menu ⋯) : texte prêt pour WhatsApp, recollable dans « Ajout en masse »
- **Progression par équipe** (menu ⋯) : équipes presque finies en premier, clic = filtre
- **Export / import** JSON et CSV (onglet Données) : fichiers validés, envoyés au compte si connecté

### Badges (7)
Premier sticker · Collectionneur (50) · Album complet · Chasseur de shiny (5) ·
Échangeur · Explorateur (5 albums) · Maître Panini (500)

### Partage & onboarding
- **Tour de bienvenue** 6 étapes au premier lancement
- **Image de progression** partageable par album (html2canvas)
- **Mode scan rapide ⚡** : plein écran mobile, swipe ou boutons, uniquement les manquants
- Lien `?trade=xxxxx` s'ouvre et pré-remplit automatiquement

### Échanges (4 onglets)
- Mon annonce · Trouver (code) · Comparer (pseudo) · **⚡ Matches** (automatique, top 20, classé par score)
- **Propositions** : proposer l'échange coché (onglet Comparer) → l'autre accepte ou refuse → chacun confirme
  quand c'est fait et sa collection se met à jour (une seule fois, vérifié côté base). Pastille sur « Échanges »
- **Échange fait** : on coche ce qui a été donné / reçu, la collection se met à jour d'un coup
  (chacun valide de son côté : personne ne peut écrire dans la collection d'un autre)

### UI Premium
- Hero cosmique : fond 4 couches, 6 cartes Panini flottantes, halos lumineux, 30 étoiles
- Cartes albums : hover rebondi `cubic-bezier`, ombre colorée, sash "FIFA WORLD CUP"
- Stickers : tilt 3D léger, reflet souris, shiny arc-en-ciel, drapeau avec halo
- Charts animés (barres en dégradé, donut, tooltips glassmorphism)
- Navbar dégradée, bouton Connexion doré avec glow

### Robustesse
- Error Boundary → Sentry (prod, Error monitoring)
- Open Graph / Twitter Card
- Mentions légales
- **PWA offline** (service worker, cache-first assets)
- 69 tests Vitest + 7 parcours Playwright (ordinateur et mobile)

### Langues
- Français, anglais, espagnol (détection du navigateur, choix mémorisé)
- Restent en français : noms d'équipes et nationalités des joueurs (données), mentions légales

---

## Sécurité 🔒
Tout est dans [`supabase/security.sql`](supabase/security.sql) (ré-exécutable) :
- RLS activé sur `collection`, `trades`, `profiles` : chacun ne lit et n'écrit que ses lignes
- `trades` : accès via `get_trade_by_token(token)` RPC uniquement
- Storage : upload public retiré
- `profiles` : lecture `to authenticated` uniquement
- `get_user_collection` + `find_trade_matches` : fonctions RPC dédiées, `EXECUTE` retiré à `anon`
- La clé `anon` est publique par nature (bundle JS) : seule RLS protège les données

---

## Roadmap 🔲

### Avant la mise en ligne
- [ ] `LegalModal.tsx` : remplacer `[Ton prénom]` et `[ton.email@exemple.com]`
- [ ] Créditer la Fjelstul World Cup Database (CC-BY-NC-SA) dans l'appli, à côté des crédits photos
- [ ] Vercel : définir `VITE_SENTRY_DSN` dans les variables d'environnement
- [ ] Supabase → Auth → URL Configuration : URL Vercel au lieu de `localhost:5173`
- [ ] Relancer `supabase/security.sql` (nouvelle version de `find_trade_matches`, réservée à l'utilisateur connecté)
- [ ] Exécuter `supabase/trade_offers.sql` (propositions d'échange)

### Données
- [ ] Checklist Panini complète de 1994 (444 stickers), puis `node scripts/import-checklists.mjs`

### Fonctionnalités

### Qualité
- [ ] Tester les parcours connectés (connexion, synchro, échanges, matches) sur le vrai Supabase
- [ ] Usage commercial (pub, abonnement) incompatible avec la licence NC des effectifs : à trancher avant

---

## Supabase — Migrations SQL (dans l'ordre)

> Historique des migrations déjà passées. Pour la sécurité, la référence est désormais [`supabase/security.sql`](supabase/security.sql).

```sql
-- Profil auto
create or replace function public.handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, username) values (new.id, split_part(new.email, '@', 1))
  on conflict (id) do nothing; return new;
end; $$ language plpgsql security definer;
create trigger on_auth_user_created after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Contraintes trades
alter table public.trades add constraint trades_user_id_unique unique (user_id);
alter table public.trades add constraint trades_user_id_profiles_fkey
  foreign key (user_id) references public.profiles(id);

-- sticker_number en texte (codes 2026 comme "MEX14")
alter table public.collection alter column sticker_number type text;

-- Sécurité RLS
drop policy if exists "Trades readable by token" on public.trades;
create or replace function public.get_trade_by_token(token text)
  returns table (have_stickers jsonb, want_stickers jsonb, username text)
  language sql security definer set search_path = public as $$
  select t.have_stickers, t.want_stickers, p.username
  from public.trades t left join public.profiles p on p.id = t.user_id
  where t.share_token = token; $$;
grant execute on function public.get_trade_by_token(text) to authenticated;

drop policy if exists "Auth users can upload stickers" on storage.objects;

drop policy if exists "Profiles are public" on public.profiles;
create policy "Profiles readable by authenticated users" on public.profiles
  for select to authenticated using (true);

create or replace function public.get_user_collection(target_user_id uuid)
  returns table (edition_id text, sticker_number text, owned boolean, duplicates int)
  language sql security definer set search_path = public as $$
  select edition_id, sticker_number, owned, duplicates from public.collection
  where user_id = target_user_id; $$;
grant execute on function public.get_user_collection(uuid) to authenticated;

-- Matching automatique (voir trade_matching.sql pour l'implémentation complète)
-- grant execute on function public.find_trade_matches(uuid) to authenticated;

-- Realtime
alter publication supabase_realtime add table collection;
```

### ⚠️ Après déploiement Vercel
Supabase → Auth → URL Configuration → remplacer `http://localhost:5173` par l'URL Vercel.

---

## Conventions
- Imports store : `from '../store/index'`
- `activeTab` dans `useUIStore`, jamais en state local de composant
- `number` sticker accepte `string | number` — ne jamais extraire les chiffres d'un code
- Un changement sur `stickers.ts` ou `store/index.ts` → `npx vitest run`
- Listeners clavier vérifient `tagName !== 'INPUT'/'TEXTAREA'`

---

## Déploiement Vercel
```bash
npm run build   # vérifier 0 erreur TypeScript
# Push GitHub → connecte repo dans Vercel → Deploy (gratuit, sans CB)
```

Variables d'environnement Vercel :

| Variable          | Rôle                                                  |
|-------------------|-------------------------------------------------------|
| `VITE_SENTRY_DSN` | Active Sentry en prod (absent = Sentry désactivé)     |
| `VITE_SUPABASE_URL` | URL du projet Supabase (absent = projet par défaut du code) |
| `VITE_SUPABASE_ANON_KEY` | Clé publique `anon` du projet                  |
