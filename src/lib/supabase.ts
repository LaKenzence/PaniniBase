/**
 * src/lib/supabase.ts
 *
 * SUPABASE INTEGRATION — à décommenter quand tu es prêt
 *
 * 1. npm install @supabase/supabase-js
 * 2. Crée un projet sur https://supabase.com
 * 3. Remplis les valeurs ci-dessous depuis ton dashboard Supabase
 * 4. Décommente le code
 * 5. Remplace useCollectionStore localStorage par des appels Supabase
 */

// import { createClient } from '@supabase/supabase-js';
//
// const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
// const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
//
// export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * ─── SCHÉMA SQL À COLLER DANS SUPABASE SQL EDITOR ───────────────────────────
 *
 * -- Éditions (données en dur, rarement modifiées)
 * CREATE TABLE editions (
 *   id          TEXT PRIMARY KEY,          -- '98', '06', '22'...
 *   year        INTEGER NOT NULL,
 *   label       TEXT NOT NULL,
 *   host_country TEXT NOT NULL,
 *   host_flag   TEXT NOT NULL,
 *   total_stickers INTEGER NOT NULL,
 *   bg_gradient TEXT NOT NULL,
 *   col_key     TEXT NOT NULL
 * );
 *
 * -- Joueurs (entités cross-éditions)
 * CREATE TABLE players (
 *   key         TEXT PRIMARY KEY,           -- 'messi', 'cr7'...
 *   name        TEXT NOT NULL,
 *   flag        TEXT NOT NULL,
 *   nationality TEXT NOT NULL,
 *   position    TEXT NOT NULL
 * );
 *
 * -- Stickers
 * CREATE TABLE stickers (
 *   id          TEXT PRIMARY KEY,           -- '98-4', '06-50'...
 *   edition_id  TEXT REFERENCES editions(id),
 *   number      INTEGER NOT NULL,
 *   category    TEXT NOT NULL DEFAULT 'player',  -- player|badge|logo|stadium|special|shiny
 *   is_shiny    BOOLEAN DEFAULT false,
 *   team_name   TEXT,
 *   player_name TEXT,
 *   nationality TEXT,
 *   flag        TEXT,
 *   position    TEXT,
 *   jersey_number INTEGER,
 *   club        TEXT,
 *   col_key     TEXT,
 *   player_key  TEXT REFERENCES players(key)
 * );
 *
 * -- Collection utilisateur (Row Level Security activé !)
 * CREATE TABLE user_collection (
 *   id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
 *   sticker_id  TEXT REFERENCES stickers(id),
 *   owned       BOOLEAN DEFAULT false,
 *   duplicates  INTEGER DEFAULT 0,
 *   updated_at  TIMESTAMPTZ DEFAULT NOW(),
 *   UNIQUE(user_id, sticker_id)
 * );
 *
 * -- Row Level Security
 * ALTER TABLE user_collection ENABLE ROW LEVEL SECURITY;
 * CREATE POLICY "Users own their collection"
 *   ON user_collection FOR ALL
 *   USING (auth.uid() = user_id)
 *   WITH CHECK (auth.uid() = user_id);
 */

/**
 * ─── MIGRATION DU STORE ──────────────────────────────────────────────────────
 *
 * Pour migrer useCollectionStore vers Supabase :
 *
 * 1. Au login, fetch user_collection depuis Supabase → hydrate le store Zustand
 * 2. Sur setOwned / setDuplicates, upsert dans Supabase en parallèle du state local
 * 3. Garder le state local comme cache optimiste (UI instantanée)
 *
 * Exemple de upsert :
 *
 * const { error } = await supabase
 *   .from('user_collection')
 *   .upsert({
 *     user_id: session.user.id,
 *     sticker_id: `${editionId}-${number}`,
 *     owned: true,
 *     duplicates: 0,
 *   }, { onConflict: 'user_id,sticker_id' });
 */

export {};
