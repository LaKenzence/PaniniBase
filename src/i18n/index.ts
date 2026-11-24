import { useCallback } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { en } from './en';
import { es } from './es';
import { TEAMS_EN, TEAMS_ES } from './teams';

// Traduction légère : le texte français sert de clé, les dictionnaires en/es
// le traduisent. Une phrase absente d'un dictionnaire reste en français.
// Variables : t('{n} stickers ajoutés', { n: 3 }).

export type Lang = 'fr' | 'en' | 'es';
export const LANGS: Array<{ id: Lang; label: string; flag: string }> = [
  { id: 'fr', label: 'Français', flag: '🇫🇷' },
  { id: 'en', label: 'English', flag: '🇬🇧' },
  { id: 'es', label: 'Español', flag: '🇪🇸' },
];

// Les noms d'équipes (données) passent par le même t() que l'interface
const DICTS: Record<Lang, Record<string, string>> = { fr: {}, en: { ...TEAMS_EN, ...en }, es: { ...TEAMS_ES, ...es } };

const detect = (): Lang => {
  const nav = typeof navigator !== 'undefined' ? navigator.language.slice(0, 2) : 'fr';
  return nav === 'en' || nav === 'es' ? nav : 'fr';
};

interface LangState { lang: Lang; setLang: (l: Lang) => void; }

export const useLangStore = create<LangState>()(
  persist(
    (set) => ({ lang: detect(), setLang: (lang) => set({ lang }) }),
    { name: 'paninibase-lang' },
  ),
);

export type Vars = Record<string, string | number>;

// Pluriel : 'singulier|pluriel' choisi selon vars.n. En français 0 et 1 sont au
// singulier (« 0 doublon »), en anglais et en espagnol seul 1 l'est.
const plural = (lang: Lang, text: string, vars?: Vars) => {
  if (!text.includes('|') || typeof vars?.n !== 'number') return text;
  const [one, many] = text.split('|');
  return (lang === 'fr' ? vars.n > 1 : vars.n !== 1) ? many : one;
};

export const translate = (lang: Lang, fr: string, vars?: Vars): string => {
  const text = plural(lang, DICTS[lang][fr] ?? fr, vars);
  return vars ? text.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m)) : text;
};

/** Nom d'album : « Mexique 1970 » → « Mexico 1970 » (pays traduit, année gardée). */
export const albumName = (label: string, tr: (fr: string) => string) => {
  const m = label.match(/^(.*) (\d{4})$/);
  return m ? `${tr(m[1])} ${m[2]}` : tr(label);
};

/** Nom affiché d'un sticker : « Écusson Brésil » devient « Brazil badge » en anglais. */
export const stickerName = (s: { category: string; teamName?: string; player?: { name: string } }, tr: (fr: string, vars?: Vars) => string) =>
  s.category === 'badge' ? tr('Écusson {team}', { team: tr(s.teamName ?? '') }) : s.player?.name ?? tr(s.teamName ?? '');

/** Pour le code hors composant (store, utilitaires). */
export const t = (fr: string, vars?: Vars) => translate(useLangStore.getState().lang, fr, vars);

/** Dans un composant : re-rend au changement de langue. */
export const useT = () => {
  const lang = useLangStore((s) => s.lang);
  return useCallback((fr: string, vars?: Vars) => translate(lang, fr, vars), [lang]);
};
