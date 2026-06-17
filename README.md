# ⚽ PaniniBase

Base de données complète des stickers Panini Coupe du Monde (1970–2026).
Gestion de collection, échanges, auth Supabase, PWA.

---

## Stack

| Couche    | Techno                          |
|-----------|---------------------------------|
| Framework | React 18 + TypeScript           |
| State     | Zustand + persist               |
| Style     | CSS variables inline (dark)     |
| Build     | Vite                            |
| Auth + DB | Supabase (PostgreSQL + Storage) |
| Deploy    | Vercel                          |

---

## Démarrage

```bash
cd paninibase && npm install && npm run dev
# http://localhost:5173
```

---

## Structure

```
src/
├── types/index.ts             # Edition, Sticker (imageUrl?), Player, CollectionMap
├── data/stickers.ts           # 15 albums, 2026 complet (1034 stickers codes officiels)
├── store/index.ts             # useAuthStore, useCollectionStore, useTradesStore, useUIStore
├── hooks/index.ts             # useGlobalStats, useEditionStats, useTeamStats, useFilteredStickers
├── lib/supabase.ts            # Client Supabase
├── components/
│   ├── AuthModal.tsx          # Login/signup dark theme toggle
│   ├── StickerCard.tsx        # Carte holo + imageUrl + fallback drapeau
│   ├── DetailPanel.tsx        # Détail sticker + image cliquable + voisins
│   └── GlobalSearch.tsx       # Recherche globale Ctrl+K dark theme
├── views/
│   ├── HomeView.tsx           # Grille albums + progress
│   ├── AlbumView.tsx          # Filtres + position + grille/liste + sélection multiple
│   ├── PlayerView.tsx         # Cross-éditions joueur
│   ├── StatsView.tsx          # Dashboard stats + charts recharts + export JSON/CSV
│   └── TradeView.tsx          # Échanges doublons + lien token partageable
├── App.tsx                    # Layout + auth + nav desktop/mobile
├── main.tsx
└── index.css                  # Dark theme vars + animations holo
public/
├── logo.svg / logo-192.png / logo-512.png
└── manifest.json              # PWA
```

---

## Design system

- Palette : `#070C18` base · `#0D1526` card · `#1A2744` elevated
- Gold `#C9A227` · Green `#2ECC71` · Red `#E74C3C` · Font Inter
- Tout en inline style avec CSS variables — pas de classes Tailwind
- Animations : shimmer holo hover, rainbow shiny, slide-in, pulse-glow, toast notification
- Mobile : bottom nav fixe + bottom sheet user + topbar sans nav sur mobile

---

## Fonctionnalités ✅

- 15 albums (1970–2026), album 2026 complet 1034 stickers codes officiels
- Extra Stickers 2026 : 20 joueurs × 4 versions (Purple/Bronze/Silver/Gold)
- Auth Supabase email (pseudo + email + mdp, confirmation mail)
- Collection sync Supabase + localStorage fallback
- Filtres all/owned/missing/dupes + équipe + position
- **Sélection multiple** : mode ☑, checkbox, Ajouter/Retirer en masse
- **Raccourcis clavier** : Espace=✓/✕, S=sélection, Esc=fermer, Ctrl+K=recherche
- Vue grille + vue liste dans AlbumView
- Recherche globale dark theme (Ctrl+K), groupée par joueur
- Panneau détail + image cliquable plein écran + stickers voisins
- Page joueur cross-éditions
- **Export/Import JSON et CSV**
- Mode échange : doublons + recherches + lien token partageable
- Support images stickers (imageUrl Supabase Storage)
- Dashboard stats : KPIs, bar chart, pie chart, top 5 albums
- PWA installable (manifest + meta tags)
- Responsive mobile : bottom nav + topbar sans nav sur petit écran

---

## Roadmap 🔲

- [ ] Compléter albums 1970–2022 avec vrais codes Panini
- [ ] Scraper images worldtradingcards.com → Supabase Storage
- [ ] Page profil public `paninibase.com/u/username`
- [ ] Comparaison de collections entre users
- [ ] Mode scan rapide mobile (cocher vite en ouvrant pochettes)
- [ ] Matching automatique échanges entre users
- [ ] PWA service worker (offline)
- [ ] Positions joueurs 2026 (tous à 'Milieu' par défaut faute de données)

---

## Supabase

```
URL     : https://vaufybtidzejfoqgbpvo.supabase.co
Tables  : collection, trades, profiles (RLS activé)
Storage : bucket 'stickers' (public) — ex: mbappe.png
Auth    : email activée
```

SQL schéma initial dans `src/lib/supabase.ts`.

---

## Ajouter des stickers

```typescript
mkPlayer(editionId, code, nom, equipe, flag, colKey, position, jersey, club, playerKey?, isShiny?, imageUrl?)
mkBadge(editionId, code, teamName, flag, colKey)

// Shiny sans playerKey :
mkPlayer('26', 'FRA10', 'Mbappé', 'France', '🇫🇷', 'fr', 'Attaquant', 10, 'Real Madrid', undefined, true)
// Avec image :
mkPlayer('26', 'FRA10', 'Mbappé', ..., 'mbappe', true, 'https://...supabase.co/storage/v1/object/public/stickers/mbappe.png')
```

---

## Déploiement Vercel

```bash
npm run build  # génère dist/
# Push GitHub → connecte dans Vercel → Vite détecté auto
```
