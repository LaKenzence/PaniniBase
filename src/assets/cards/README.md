# Cartes flottantes de l'accueil

Les cartes autour du titre de l'accueil viennent de ce dossier (`card-hero.webp`, `card-trophy.webp`, `card-2.webp`…).
Leur placement est réglé dans `HeroScene` (`src/views/HomeView.tsx`).

`card-hero.webp` est en haute définition. `card-2`, `card-5`, `card-7` et `card-trophy` viennent d'anciennes planches
basse résolution : à remplacer en gardant le **même nom de fichier**.

## Règles

- **Joueurs fictifs uniquement** : pas de visage reconnaissable d'un vrai joueur (droit à l'image)
- Une carte par image, **droite** (pas inclinée, l'inclinaison est faite en CSS), recadrée au ras du bord
- Portrait 3:4, environ 1086×1448

## Prompt

> Fictional football player (not a real person) in a {COLOR} kit, {ACTION}, collectible trading card, holographic
> prismatic silver border, cosmic purple and blue galaxy background with stadium lights, ultra detailed, vertical 3:4,
> card filling the whole image, straight (not tilted), no text, no logo.

Variantes à essayer pour {COLOR} / {ACTION} :
- white / celebrating with arms raised → `card-2.webp`
- green goalkeeper / diving to save the ball → `card-5.webp`
- red / dribbling with the ball → `card-7.webp`
- the golden football trophy (generic, not the official FIFA trophy) glowing in space → `card-trophy.webp`
