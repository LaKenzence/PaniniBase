import React, { useEffect, useState } from 'react';
import { Sparkles, Search, CheckSquare, RotateCcw, ArrowLeftRight, Keyboard, X, ArrowRight, ArrowLeft } from 'lucide-react';
import { C } from '../theme';
import { useT } from '../i18n';

const STORAGE_KEY = 'paninibase-onboarding-seen';

const STEPS = [
  {
    Icon: Sparkles,
    title: 'Bienvenue sur PaniniBase !',
    desc: "Gère ta collection de stickers Panini Coupe du Monde, de 1970 à 2026. Clique sur un sticker pour le marquer comme possédé, ajoute des doublons, et suis ta progression album par album.",
  },
  {
    Icon: Search,
    title: 'Recherche & filtres',
    desc: "Cherche un joueur ou un numéro avec Ctrl+K. Dans un album, le bouton « Filtres » regroupe le statut, le poste et l'équipe en un seul endroit.",
  },
  {
    Icon: CheckSquare,
    title: 'Sélection multiple',
    desc: "Dans le menu ⋯ d'un album (ou touche S), la sélection multiple coche plusieurs stickers d'un coup. Tu peux aussi coller une liste de numéros (ex : 1,5,12-18) pour les ajouter en masse.",
  },
  {
    Icon: RotateCcw,
    title: 'Annuler / Rétablir',
    desc: "Une erreur de clic ? Le bouton « Annuler » du message de confirmation, ou Ctrl+Z, revient en arrière. Ctrl+Y rétablit.",
  },
  {
    Icon: ArrowLeftRight,
    title: 'Échanges & comparaison',
    desc: "Dans l'onglet Échanges, partage tes doublons, trouve un échange via un code, ou compare directement ta collection avec celle d'un ami par son pseudo.",
  },
  {
    Icon: Keyboard,
    title: "C'est parti !",
    desc: "Appuie sur « ? » à tout moment pour revoir la liste complète des raccourcis clavier. Bonne collection !",
  },
];

export const OnboardingTour: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const t = useT();

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      // Laisse le splash screen se terminer avant d'afficher la visite
      const t = setTimeout(() => setVisible(true), 900);
      return () => clearTimeout(t);
    }
  }, []);

  const finish = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  };

  useEffect(() => {
    if (!visible) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') finish();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, step]);

  if (!visible) return null;

  const { Icon, title, desc } = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const next = () => (isLast ? finish() : setStep((s) => s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  return (
    <div
      role="dialog" aria-modal="true" aria-label={t(title)}
      style={{ position: 'fixed', inset: 0, zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(4,8,20,0.88)', backdropFilter: 'blur(12px)' }}
      onClick={(e) => e.target === e.currentTarget && finish()}
    >
      <div style={{ width: '100%', maxWidth: '380px', background: C.bgCard, border: '1px solid rgba(255,255,255,0.1)', borderRadius: '22px', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.7)' }}>
        <div style={{ height: '2px', background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)` }} />

        <div style={{ padding: '28px 28px 20px', textAlign: 'center' }}>
          <button onClick={finish} aria-label={t('Passer la visite')} style={{ position: 'absolute', top: '16px', right: '16px', width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: C.textTertiary, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={14} />
          </button>

          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(201,162,39,0.12)', border: '2px solid rgba(201,162,39,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', color: C.gold }}>
            <Icon size={26} />
          </div>

          <h2 style={{ fontSize: '17px', fontWeight: 800, color: C.textPrimary, marginBottom: '10px' }}>{t(title)}</h2>
          <p style={{ fontSize: '12.5px', color: C.textSecondary, lineHeight: 1.6 }}>{t(desc)}</p>
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', paddingBottom: '18px' }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{ width: i === step ? '18px' : '6px', height: '6px', borderRadius: '3px', background: i === step ? C.gold : 'rgba(255,255,255,0.15)', transition: 'all 0.25s' }} />
          ))}
        </div>

        <div style={{ display: 'flex', gap: '8px', padding: '0 24px 24px' }}>
          {step > 0 && (
            <button
              onClick={prev}
              className="btn-tactile"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: C.textSecondary, fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
            >
              <ArrowLeft size={14} />
            </button>
          )}
          <button
            onClick={next}
            className="btn-tactile"
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', padding: '12px', borderRadius: '12px', background: C.gold, color: '#000', fontSize: '13px', fontWeight: 800, border: 'none', cursor: 'pointer' }}
          >
            {isLast ? t("C'est parti !") : t('Suivant')} {!isLast && <ArrowRight size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
};

/** Permet de relancer la visite manuellement (ex: depuis le menu utilisateur) */
export function resetOnboarding() {
  localStorage.removeItem(STORAGE_KEY);
}
