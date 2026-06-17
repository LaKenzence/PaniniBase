import React, { useEffect, useState } from 'react';
import { useTradesStore, useCollectionStore, useAuthStore, useUIStore } from '../store/index';
import { STICKERS_BY_EDITION, EDITIONS, BG } from '../data/stickers';
import type { Sticker } from '../types';

const StickerChip: React.FC<{ sticker: Sticker; tag?: string; tagColor?: string; onRemove?: () => void }> = ({ sticker, tag, tagColor, onRemove }) => {
  const bg = BG[sticker.player?.colKey ?? ''] ?? 'linear-gradient(135deg,#0d1a3a,#1a2f6b)';
  const edition = EDITIONS.find((e) => e.id === sticker.editionId);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', position: 'relative' }}>
      {/* Mini card */}
      <div style={{ width: '32px', height: '42px', borderRadius: '6px', background: bg, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
        {sticker.imageUrl
          ? <img src={sticker.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span>{sticker.player?.flag}</span>
        }
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '12px', fontWeight: 700, color: '#F0F4FF', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {sticker.player?.name ?? sticker.teamName}
        </p>
        <p style={{ fontSize: '10px', color: '#4A5A7A', margin: '2px 0 0' }}>
          {edition?.year} · #{sticker.number}
        </p>
      </div>
      {tag && (
        <span style={{ fontSize: '9px', fontWeight: 700, color: tagColor ?? '#C9A227', background: `${tagColor ?? '#C9A227'}18`, padding: '2px 7px', borderRadius: '6px', flexShrink: 0, whiteSpace: 'nowrap' }}>
          {tag}
        </span>
      )}
      {onRemove && (
        <button onClick={onRemove} style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#4A5A7A', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>×</button>
      )}
    </div>
  );
};

export const TradeView: React.FC = () => {
  const { user } = useAuthStore();
  const { myTrade, shareToken, loading, loadMyTrade, saveTrade, fetchTradeByToken } = useTradesStore();
  const { collection } = useCollectionStore();
  const { goHome } = useUIStore();

  const [tokenInput, setTokenInput]   = useState('');
  const [fetchedTrade, setFetchedTrade] = useState<{ have: any[]; want: any[]; username?: string } | null>(null);
  const [fetching, setFetching]       = useState(false);
  const [copied, setCopied]           = useState(false);
  const [saved, setSaved]             = useState(false);
  const [activeTab, setActiveTab]     = useState<'my' | 'find'>('my');

  const dupStickers = Object.values(collection)
    .filter((e) => e.owned && e.duplicates > 0)
    .flatMap((e) => {
      const s = (STICKERS_BY_EDITION[e.stickerEditionId] ?? []).find((s) => String(s.number) === String(e.stickerNumber));
      return s ? [s] : [];
    });

  const missingStickers = EDITIONS.flatMap((ed) => {
    const stickers = STICKERS_BY_EDITION[ed.id] ?? [];
    return stickers.filter((s) => !collection[`${ed.id}-${s.number}`]?.owned);
  }).slice(0, 50);

  const [haveList, setHaveList] = useState<Array<{ editionId: string; number: string | number }>>([]);
  const [wantList, setWantList] = useState<Array<{ editionId: string; number: string | number }>>([]);

  useEffect(() => {
    if (user) loadMyTrade();
  }, [user]);

  useEffect(() => {
    if (myTrade) { setHaveList(myTrade.have); setWantList(myTrade.want); }
  }, [myTrade]);

  const getStickerFromEntry = (entry: { editionId: string; number: string | number }) => {
    const stickers = STICKERS_BY_EDITION[entry.editionId] ?? [];
    return stickers.find((s) => String(s.number) === String(entry.number)) ?? null;
  };

  const handleSave = async () => {
    await saveTrade(haveList as any, wantList as any);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}?trade=${shareToken}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFetch = async () => {
    if (!tokenInput.trim()) return;
    setFetching(true);
    const result = await fetchTradeByToken(tokenInput.trim());
    setFetchedTrade(result);
    setFetching(false);
  };

  // Not logged in
  if (!user) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', textAlign: 'center', background: '#070C18' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(201,162,39,0.1)', border: '2px solid rgba(201,162,39,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 20px' }}>🔄</div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#F0F4FF', marginBottom: '10px' }}>Mode Échange</h2>
        <p style={{ fontSize: '13px', color: '#4A5A7A', lineHeight: 1.7, marginBottom: '24px', maxWidth: '280px' }}>
          Connecte-toi pour partager tes doublons et trouver les stickers qu'il te manque.
        </p>
        <button onClick={goHome} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#8A9BBF', fontSize: '13px', cursor: 'pointer' }}>
          ← Retour
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', background: '#070C18' }}>
      {/* Header */}
      <div style={{ flexShrink: 0, padding: '14px 20px 0', background: '#0D1526', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <h1 style={{ fontSize: '16px', fontWeight: 800, color: '#F0F4FF' }}>🔄 Échanges</h1>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', fontSize: '11px', color: '#4A5A7A' }}>
            <span style={{ color: '#2ECC71', fontWeight: 600 }}>{dupStickers.length} doublons</span>
            <span>·</span>
            <span style={{ color: '#E74C3C', fontWeight: 600 }}>{missingStickers.length} manquants</span>
          </div>
        </div>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '2px' }}>
          {[
            { key: 'my', label: '📋 Mon annonce' },
            { key: 'find', label: '🔍 Trouver un échange' },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setActiveTab(key as any)} style={{ padding: '8px 14px', fontSize: '12px', fontWeight: activeTab === key ? 700 : 400, color: activeTab === key ? '#F0F4FF' : '#4A5A7A', background: 'none', border: 'none', cursor: 'pointer', borderBottom: `2px solid ${activeTab === key ? '#C9A227' : 'transparent'}`, transition: 'all 0.15s' }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>

        {/* ── MON ANNONCE ── */}
        {activeTab === 'my' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Have */}
            <div style={{ background: '#0D1526', border: '1px solid rgba(46,204,113,0.15)', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2ECC71' }} />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#2ECC71' }}>J'ai à échanger</span>
                  <span style={{ fontSize: '11px', color: '#4A5A7A' }}>({haveList.length})</span>
                </div>
                <button
                  onClick={() => setHaveList(dupStickers.map((s) => ({ editionId: s.editionId, number: s.number })))}
                  style={{ fontSize: '10px', color: '#4A5A7A', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', padding: '3px 8px', cursor: 'pointer' }}
                >
                  ↺ Sync doublons
                </button>
              </div>
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '200px', overflowY: 'auto' }}>
                {haveList.length === 0 ? (
                  <p style={{ fontSize: '12px', color: '#4A5A7A', fontStyle: 'italic', textAlign: 'center', padding: '12px 0' }}>Aucun sticker — clique sur "Sync doublons"</p>
                ) : haveList.map((entry) => {
                  const s = getStickerFromEntry(entry);
                  if (!s) return null;
                  return <StickerChip key={`${entry.editionId}-${entry.number}`} sticker={s} onRemove={() => setHaveList((l) => l.filter((e) => !(e.editionId === entry.editionId && String(e.number) === String(entry.number))))} />;
                })}
              </div>
            </div>

            {/* Want */}
            <div style={{ background: '#0D1526', border: '1px solid rgba(231,76,60,0.15)', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E74C3C' }} />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#E74C3C' }}>Je recherche</span>
                  <span style={{ fontSize: '11px', color: '#4A5A7A' }}>({wantList.length})</span>
                </div>
                <button
                  onClick={() => setWantList(missingStickers.slice(0, 20).map((s) => ({ editionId: s.editionId, number: s.number })))}
                  style={{ fontSize: '10px', color: '#4A5A7A', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', padding: '3px 8px', cursor: 'pointer' }}
                >
                  ↺ Sync manquants
                </button>
              </div>
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '200px', overflowY: 'auto' }}>
                {wantList.length === 0 ? (
                  <p style={{ fontSize: '12px', color: '#4A5A7A', fontStyle: 'italic', textAlign: 'center', padding: '12px 0' }}>Aucun sticker recherché</p>
                ) : wantList.map((entry) => {
                  const s = getStickerFromEntry(entry);
                  if (!s) return null;
                  return <StickerChip key={`${entry.editionId}-${entry.number}`} sticker={s} onRemove={() => setWantList((l) => l.filter((e) => !(e.editionId === entry.editionId && String(e.number) === String(entry.number))))} />;
                })}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={handleSave}
                disabled={loading}
                style={{ padding: '13px', borderRadius: '12px', background: saved ? 'rgba(46,204,113,0.15)' : '#C9A227', color: saved ? '#2ECC71' : '#000', fontWeight: 800, fontSize: '14px', border: saved ? '1px solid #2ECC71' : 'none', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                {loading ? '...' : saved ? '✓ Sauvegardé !' : '💾 Sauvegarder mon annonce'}
              </button>

              {shareToken && (
                <div style={{ padding: '14px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <p style={{ fontSize: '11px', color: '#4A5A7A', marginBottom: '8px' }}>Ton code d'échange :</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <code style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', background: 'rgba(201,162,39,0.08)', border: '1px solid rgba(201,162,39,0.2)', color: '#C9A227', fontSize: '14px', fontWeight: 700, letterSpacing: '2px' }}>
                      {shareToken}
                    </code>
                    <button
                      onClick={handleCopyLink}
                      style={{ padding: '8px 12px', borderRadius: '8px', background: copied ? 'rgba(46,204,113,0.15)' : 'rgba(255,255,255,0.06)', border: `1px solid ${copied ? '#2ECC71' : 'rgba(255,255,255,0.1)'}`, color: copied ? '#2ECC71' : '#8A9BBF', fontSize: '12px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s' }}
                    >
                      {copied ? '✓ Copié' : '🔗 Copier lien'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TROUVER ── */}
        {activeTab === 'find' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#0D1526', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '16px' }}>
              <p style={{ fontSize: '12px', color: '#4A5A7A', lineHeight: 1.6, marginBottom: '12px' }}>
                Entre le code d'échange d'un collectionneur pour voir ses doublons et ce qu'il recherche.
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="Code (ex: a3f9bc)"
                  onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
                  style={{ flex: 1, padding: '11px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#F0F4FF', fontSize: '13px', outline: 'none' }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#C9A227')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
                <button
                  onClick={handleFetch}
                  disabled={fetching}
                  style={{ padding: '11px 16px', borderRadius: '10px', background: '#C9A227', color: '#000', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer' }}
                >
                  {fetching ? '...' : 'Voir →'}
                </button>
              </div>
            </div>

            {fetchedTrade && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '12px', background: 'rgba(201,162,39,0.08)', border: '1px solid rgba(201,162,39,0.2)' }}>
                  <span style={{ fontSize: '20px' }}>👤</span>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#F0F4FF', margin: 0 }}>{fetchedTrade.username ?? 'Anonyme'}</p>
                    <p style={{ fontSize: '11px', color: '#4A5A7A', margin: '2px 0 0' }}>{fetchedTrade.have.length} doublons · {fetchedTrade.want.length} recherchés</p>
                  </div>
                </div>

                {/* Ce qu'il propose */}
                <div style={{ background: '#0D1526', border: '1px solid rgba(46,204,113,0.15)', borderRadius: '16px', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2ECC71' }} />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#2ECC71' }}>Il/Elle propose ({fetchedTrade.have.length})</span>
                  </div>
                  <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '200px', overflowY: 'auto' }}>
                    {fetchedTrade.have.map((entry: any) => {
                      const s = getStickerFromEntry(entry);
                      if (!s) return null;
                      const iWant = wantList.some((e) => e.editionId === entry.editionId && String(e.number) === String(entry.number));
                      return <StickerChip key={`${entry.editionId}-${entry.number}`} sticker={s} tag={iWant ? '← Tu le veux !' : undefined} tagColor="#2ECC71" />;
                    })}
                  </div>
                </div>

                {/* Ce qu'il recherche */}
                <div style={{ background: '#0D1526', border: '1px solid rgba(231,76,60,0.15)', borderRadius: '16px', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E74C3C' }} />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#E74C3C' }}>Il/Elle recherche ({fetchedTrade.want.length})</span>
                  </div>
                  <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '200px', overflowY: 'auto' }}>
                    {fetchedTrade.want.map((entry: any) => {
                      const s = getStickerFromEntry(entry);
                      if (!s) return null;
                      const iHave = haveList.some((e) => e.editionId === entry.editionId && String(e.number) === String(entry.number));
                      return <StickerChip key={`${entry.editionId}-${entry.number}`} sticker={s} tag={iHave ? '← Tu l\'as !' : undefined} tagColor="#C9A227" />;
                    })}
                  </div>
                </div>
              </div>
            )}

            {fetchedTrade === null && tokenInput && !fetching && (
              <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.2)', textAlign: 'center', fontSize: '13px', color: '#E74C3C' }}>
                Code introuvable — vérifie le code et réessaie
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
