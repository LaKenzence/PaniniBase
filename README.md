# ⚽ PaniniBase

Base de données complète des stickers Panini Coupe du Monde, de 1970 à 2026.  
Gestion de collection, suivi des doublons, historique des joueurs cross-éditions.

---

## Stack

| Couche      | Techno                   |
|-------------|--------------------------|
| Framework   | React 18 + TypeScript    |
| State       | Zustand (+ persist)      |
| Style       | Tailwind CSS             |
| Build       | Vite                     |
| DB (futur)  | Supabase (PostgreSQL)    |
| Deploy      | Vercel                   |

---

## Démarrage rapide

```bash
cd paninibase
npm install
npm run dev
```

L'app tourne sur `http://localhost:5173`.

---

## Structure du projet

```
src/
├── types/          # TypeScript : Edition, Sticker, Player, CollectionEntry...
├── data/
│   └── stickers.ts # Données seed : éditions, stickers, joueurs cross-éditions
├── store/
│   └── index.ts    # Zustand : CollectionStore (persisté) + UIStore (navigation)
├── hooks/
│   └── index.ts    # Hooks dérivés : stats globales, par édition, par équipe, filtrés
├── components/
│   ├── StickerCard.tsx    # Carte sticker (grille)
│   ├── DetailPanel.tsx    # Panneau latéral de détail
│   └── GlobalSearch.tsx   # Recherche globale topbar
├── views/
│   ├── HomeView.tsx        # Grille des albums
│   ├── AlbumView.tsx       # Vue album avec filtres + grille + panel
│   ├── PlayerView.tsx      # Historique d'un joueur cross-éditions
│   └── CollectionView.tsx  # Stats collection + import/export
├── lib/
│   └── supabase.ts         # Stub + schéma SQL prêt à l'emploi
├── App.tsx         # Layout principal + topbar
├── main.tsx
└── index.css       # CSS variables + reset
```

---

## Fonctionnalités actuelles

- ✅ 15 albums référencés (1970–2026)
- ✅ Stickers joueurs, écussons, shiny
- ✅ Gestion de collection (posséder / doublons) persistée en localStorage
- ✅ Filtres : tous / possédés / manquants / doublons
- ✅ Filtre par équipe avec compteur de complétion
- ✅ Recherche globale multi-éditions
- ✅ Panneau de détail avec stickers voisins
- ✅ Page joueur avec toutes ses apparitions Panini
- ✅ Export / import collection JSON
- ✅ Stats de complétion par album et par équipe

---

## Roadmap

### Phase 2 — Données complètes
- [ ] Importer tous les stickers de chaque album (scraping ou CSV)
- [ ] Ajouter les stickers spéciaux (badges, logos équipes, stades, intro pages)
- [ ] Importer les vraies images des stickers

### Phase 3 — Supabase
- [ ] Auth (email + OAuth Google)
- [ ] Migrer collection localStorage → `user_collection` Supabase
- [ ] Voir `src/lib/supabase.ts` pour le schéma SQL complet

### Phase 4 — Social
- [ ] Liste d'échange de doublons
- [ ] Partage de collection (lien public)
- [ ] Comparaison de collections entre amis

### Phase 5 — IA
- [ ] Scan photo → reconnaissance du numéro de sticker
- [ ] Suggestions de complétion

---

## Ajouter des stickers

Édite `src/data/stickers.ts`. Utilise les helpers :

```typescript
// Sticker joueur
mkPlayer(editionId, number, nom, equipe, drapeau, colKey, position, maillot, club, playerKey?, isShiny?)

// Sticker écusson
mkBadge(editionId, number, nomEquipe, drapeau, colKey)
```

Pour la clé `playerKey`, crée l'entrée correspondante dans `PLAYERS` pour activer le suivi cross-éditions.

---

## Déploiement Vercel

```bash
npm run build      # génère dist/
# Push sur GitHub, connecte le repo dans Vercel
# Vercel détecte Vite automatiquement
```

Variables d'environnement à ajouter sur Vercel quand tu branches Supabase :
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5...
```
