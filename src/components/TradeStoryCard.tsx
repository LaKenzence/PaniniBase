import React from 'react';
import type { Sticker } from '../types';
import { C } from '../theme';
import { t, stickerName } from '../i18n';
import { QrCode } from './QrCode';

interface Props {
  have: Sticker[];
  want: Sticker[];
  code: string;
  url: string;
}

const Chip: React.FC<{ s: Sticker; color: string }> = ({ s, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 20px', borderRadius: '18px', background: 'rgba(255,255,255,0.06)', border: `2px solid ${color}55` }}>
    <span style={{ fontSize: '36px' }}>{s.player?.flag}</span>
    <span style={{ fontSize: '30px', fontWeight: 800, color: '#fff', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
      {stickerName(s, t)}
    </span>
    <span style={{ fontSize: '26px', fontWeight: 900, color }}>#{s.number}</span>
  </div>
);

/**
 * Image format story Instagram (1080×1920), capturée avec html2canvas.
 * Rendue hors écran : seule l'image générée est visible par l'utilisateur.
 */
export const TradeStoryCard = React.forwardRef<HTMLDivElement, Props>(({ have, want, code, url }, ref) => (
  <div ref={ref} style={{
    width: '1080px', height: '1920px', boxSizing: 'border-box', padding: '110px 80px', display: 'flex', flexDirection: 'column', gap: '48px',
    background: `radial-gradient(ellipse 120% 60% at 50% 0%, #1a2f6b 0%, ${C.bgBase} 60%)`, color: '#fff', fontFamily: 'Inter, system-ui, sans-serif',
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '40px', fontWeight: 800, letterSpacing: '8px', color: C.gold }}>PANINIBASE</div>
      <div style={{ fontSize: '110px', fontWeight: 900, letterSpacing: '-4px', lineHeight: 1.05, marginTop: '24px' }}>{t("J'échange !")}</div>
      <div style={{ fontSize: '38px', color: C.textSecondary, marginTop: '16px' }}>
        <b style={{ color: C.green }}>{have.length}</b> {t('doublons')} · <b style={{ color: C.gold }}>{want.length}</b> {t('recherchés')}
      </div>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div style={{ fontSize: '34px', fontWeight: 900, color: C.green, letterSpacing: '2px' }}>{t('JE DONNE')}</div>
      {have.slice(0, 5).map((s) => <Chip key={s.id} s={s} color={C.green} />)}
      {have.length > 5 && <div style={{ fontSize: '28px', color: C.textSecondary }}>{t('+ {n} autres', { n: have.length - 5 })}</div>}
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div style={{ fontSize: '34px', fontWeight: 900, color: C.gold, letterSpacing: '2px' }}>{t('JE CHERCHE')}</div>
      {want.slice(0, 5).map((s) => <Chip key={s.id} s={s} color={C.gold} />)}
      {want.length > 5 && <div style={{ fontSize: '28px', color: C.textSecondary }}>{t('+ {n} autres', { n: want.length - 5 })}</div>}
    </div>

    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '40px', padding: '36px 40px', borderRadius: '36px', background: 'rgba(201,162,39,0.1)', border: `3px solid ${C.gold}` }}>
      <QrCode value={url} size={240} style={{ borderRadius: '20px' }} />
      <div>
        <div style={{ fontSize: '32px', color: C.textSecondary }}>{t('Scanne ou entre mon code')}</div>
        <div style={{ fontSize: '88px', fontWeight: 900, letterSpacing: '10px', color: C.gold, marginTop: '8px' }}>{code}</div>
      </div>
    </div>
  </div>
));
