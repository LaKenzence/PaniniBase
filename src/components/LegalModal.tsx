import React, { useEffect } from 'react';
import { X, ScrollText } from 'lucide-react';
import { C } from '../theme';
import { PHOTOS } from '../data/photos';

interface Props {
  onClose: () => void;
}

/**
 * Mentions légales minimales pour un projet personnel non commercial.
 * ⚠️ À adapter : remplace les placeholders [Ton prénom] / [ton email] par
 * tes vraies informations avant de partager le lien publiquement.
 */
export const LegalModal: React.FC<Props> = ({ onClose }) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div style={{ marginBottom: '20px' }}>
      <p style={{ fontSize: '11px', fontWeight: 700, color: C.gold, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>{title}</p>
      <p style={{ fontSize: '12.5px', color: C.textSecondary, lineHeight: 1.7 }}>{children}</p>
    </div>
  );

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(4,8,20,0.88)', backdropFilter: 'blur(10px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ width: '100%', maxWidth: '440px', maxHeight: '85vh', overflowY: 'auto', background: C.bgCard, border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}>
        <div style={{ height: '2px', background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)` }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ScrollText size={16} color={C.gold} />
            <span style={{ fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>Mentions légales</span>
          </div>
          <button onClick={onClose} aria-label="Fermer" style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: C.textTertiary, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={14} />
          </button>
        </div>

        <div style={{ padding: '22px' }}>
          <Section title="Éditeur">
            PaniniBase est un projet personnel non commercial édité par <strong style={{ color: C.textPrimary }}>[Kenzo]</strong>.
            Contact : <strong style={{ color: C.textPrimary }}>[kenzo.passelande@gmail.com]</strong>
          </Section>

          <Section title="Hébergement">
            Le site est hébergé par <strong style={{ color: C.textPrimary }}>Vercel Inc.</strong> La base de données et l'authentification sont gérées par <strong style={{ color: C.textPrimary }}>Supabase</strong>.
          </Section>

          <Section title="Données collectées">
            Adresse email et pseudo (création de compte), contenu de ta collection de stickers (possédés, doublons), et tes annonces d'échange si tu en crées. Ces données ne sont ni vendues ni partagées à des tiers.
          </Section>

          <Section title="Cookies & suivi">
            Seuls des cookies techniques (maintien de ta session de connexion) sont utilisés. Aucun cookie publicitaire ni traceur tiers. En cas d'erreur technique, des informations de diagnostic peuvent être envoyées à un service de suivi d'erreurs (Sentry), sans données personnelles volontaires.
          </Section>

          <Section title="Tes droits">
            Tu peux demander la suppression de ton compte et de tes données à tout moment en écrivant à <strong style={{ color: C.textPrimary }}>[ton.email@exemple.com]</strong>.
          </Section>

          <Section title="Propriété intellectuelle">
            "Panini" et "FIFA World Cup" sont des marques de leurs propriétaires respectifs. Ce site est un projet de fan non affilié, non commercial, à but personnel.
          </Section>

          <Section title="Sources des données">
            Effectifs des Coupes du Monde 1970–2022 : Joshua C. Fjelstul, <a href="https://github.com/jfjelstul/worldcup" target="_blank" rel="noopener noreferrer" style={{ color: C.gold }}>The Fjelstul World Cup Database</a>, sous licence CC-BY-NC-SA 4.0. La numérotation des stickers est propre à PaniniBase et ne correspond pas aux albums officiels.
          </Section>

          <Section title="Crédits photos">
            Photos des joueurs : Wikimedia Commons, sous licences libres. Les autres joueurs sont représentés par une silhouette.
          </Section>
          <ul style={{ listStyle: 'none', padding: 0, margin: '-8px 0 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {Object.values(PHOTOS).sort((a, b) => a.name.localeCompare(b.name, 'fr')).map((p) => (
              <li key={p.source} style={{ fontSize: '11px', color: C.textTertiary, lineHeight: 1.5 }}>
                <span style={{ color: C.textSecondary, fontWeight: 600 }}>{p.name}</span>
                {' — '}<a href={p.source} target="_blank" rel="noopener noreferrer" style={{ color: C.textSecondary }}>{p.author}</a>
                {' · '}{p.licenseUrl ? <a href={p.licenseUrl} target="_blank" rel="noopener noreferrer" style={{ color: C.textSecondary }}>{p.license}</a> : p.license}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
