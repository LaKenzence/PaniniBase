import React from 'react';
import { ArrowLeft, Check, Star, User as UserIcon, Heart } from 'lucide-react';
import { PLAYERS, STICKERS_BY_EDITION, EDITIONS, BG } from '../data/stickers';
import { useEditions } from '../hooks/useEditionData';
import { useUIStore, useCollectionStore } from '../store/index';
import { C } from '../theme';
import { useT, albumName } from '../i18n';
import { clickable } from '../lib/a11y';

export const PlayerView: React.FC = () => {
  const { selectedPlayerKey, goBack, goAlbum } = useUIStore();
  const { isOwned, toggleFavorite, isFavorite } = useCollectionStore();

  const allReady = useEditions('all');
  const t = useT();
  const player = selectedPlayerKey ? PLAYERS[selectedPlayerKey] : null;

  if (!player && !allReady) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent' }}>
        <p style={{ fontSize: '13px', color: C.textTertiary }}>{t('Chargement du joueur…')}</p>
      </div>
    );
  }

  if (!player) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent' }}>
        <p style={{ fontSize: '13px', color: C.textTertiary }}>{t('Joueur introuvable')}</p>
      </div>
    );
  }

  const appearances = player.editionIds.flatMap((edId) => {
    const stickers = STICKERS_BY_EDITION[edId] ?? [];
    const edition = EDITIONS.find((e) => e.id === edId);
    const sticker = stickers.find((s) => s.player?.playerKey === selectedPlayerKey);
    if (!sticker || !edition) return [];
    return [{ edition, sticker, owned: isOwned(edId, sticker.number) }];
  });

  const ownedCount = appearances.filter((a) => a.owned).length;

  return (
    <div className="slide-in view-bg" style={{ flex: 1, overflowY: 'auto' }}>
      {/* ── Hero ── */}
      <div style={{ background: 'linear-gradient(160deg, #0d1830 0%, #0a1525 100%)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '20px' }}>
        <button
          className="btn-tactile"
          onClick={goBack}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: C.textSecondary, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '5px 10px', cursor: 'pointer', marginBottom: '18px' }}
        >
          <ArrowLeft size={15} /> {t('Retour')}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(201,162,39,0.1)', border: '2px solid rgba(201,162,39,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', flexShrink: 0, boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}>
            {player.flag}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '19px', fontWeight: 800, color: C.textPrimary, letterSpacing: '-0.3px' }}>{player.name}</h2>
              <button
                className="btn-tactile"
                onClick={() => selectedPlayerKey && toggleFavorite(selectedPlayerKey)}
                aria-label={selectedPlayerKey && isFavorite(selectedPlayerKey) ? t('Retirer des favoris') : t('Ajouter aux favoris')}
                style={{
                  width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: selectedPlayerKey && isFavorite(selectedPlayerKey) ? 'rgba(231,76,60,0.12)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${selectedPlayerKey && isFavorite(selectedPlayerKey) ? 'rgba(231,76,60,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  color: selectedPlayerKey && isFavorite(selectedPlayerKey) ? C.red : C.textTertiary,
                  cursor: 'pointer',
                }}
              >
                <Heart size={14} fill={selectedPlayerKey && isFavorite(selectedPlayerKey) ? C.red : 'none'} />
              </button>
            </div>
            <p style={{ fontSize: '12px', color: C.textSecondary, marginTop: '3px' }}>{player.flag} {t(player.nationality)} · {t(player.position)}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: C.green, fontWeight: 600, background: 'rgba(46,204,113,0.1)', padding: '3px 9px', borderRadius: '20px' }}>
                <Check size={13} /> {ownedCount}/{appearances.length} {t('possédés')}
              </span>
              <span style={{ fontSize: '11px', color: C.textTertiary }}>
                {t('{n} apparition Panini|{n} apparitions Panini', { n: appearances.length })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Appearances grid ── */}
      <div style={{ padding: '20px' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, color: C.textTertiary, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>
          {t('Toutes les apparitions Panini')}
        </p>

        <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))' }}>
          {appearances.map(({ edition, sticker, owned }) => {
            const bg = BG[sticker.player?.colKey ?? ''] ?? 'linear-gradient(135deg,#1a3a6e,#2d5fa0)';
            return (
              <div
                key={edition.id}
                className="card-tactile"
                {...clickable(() => goAlbum(edition.id, { sticker: sticker.number }), `${albumName(edition.label, t)}, ${sticker.code ?? `#${sticker.number}`}${owned ? `, ${t('possédé')}` : ''}`)}
                style={{
                  background: C.glass, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderRadius: '14px', overflow: 'hidden', cursor: 'pointer',
                  border: `1px solid ${owned ? 'rgba(46,204,113,0.35)' : 'rgba(255,255,255,0.07)'}`,
                  boxShadow: owned ? '0 0 0 1px rgba(46,204,113,0.2)' : 'none',
                  transition: 'transform 0.12s, box-shadow 0.15s, border-color 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px) scale(1.03)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.55)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = owned ? '0 0 0 1px rgba(46,204,113,0.2)' : 'none'; }}
              >
                <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: bg }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(255,255,255,0.13) 0%,transparent 55%)' }} />
                  {sticker.isShiny && (
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(45deg,rgba(255,215,0,0.12),transparent,rgba(255,215,0,0.12))' }} />
                  )}

                  <span style={{ position: 'absolute', top: '6px', left: '8px', fontSize: '8.5px', fontWeight: 600, color: 'rgba(255,255,255,0.9)', background: 'rgba(0,0,0,0.45)', padding: '2px 6px', borderRadius: '5px' }}>
                    #{sticker.number}
                  </span>

                  {owned && (
                    <span style={{ position: 'absolute', top: '6px', right: '8px', width: '18px', height: '18px', borderRadius: '50%', background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 6px rgba(46,204,113,0.6)' }}>
                      <Check size={10} color="#fff" />
                    </span>
                  )}

                  {sticker.isShiny && (
                    <span style={{ position: 'absolute', bottom: '8px', right: '8px', color: C.shiny, filter: 'drop-shadow(0 0 4px rgba(255,215,0,0.7))' }}>
                      <Star size={13} fill={C.shiny} />
                    </span>
                  )}

                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.18)', border: '2px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '6px' }}>
                    {sticker.player?.flag}
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.95)', textAlign: 'center', padding: '0 8px', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                    {sticker.player?.name.split(' ').pop()}
                  </span>
                </div>

                <div style={{ padding: '9px 10px' }}>
                  <p style={{ fontSize: '12.5px', fontWeight: 700, color: C.textPrimary, margin: 0 }}>{edition.year}</p>
                  <p style={{ fontSize: '11px', color: C.textTertiary, margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sticker.player?.club}</p>
                </div>
              </div>
            );
          })}
        </div>

        {appearances.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0', color: C.textTertiary }}>
            <UserIcon size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
            <p style={{ fontSize: '13px' }}>{t('Aucune apparition trouvée')}</p>
          </div>
        )}
      </div>
    </div>
  );
};
