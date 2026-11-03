import React, { useEffect } from 'react';
import { Check, X, Clock, ArrowLeftRight, RefreshCw } from 'lucide-react';
import { useOffersStore, type TradeOffer, type OfferStatus } from '../store/index';
import { useT } from '../i18n';
import { C } from '../theme';

interface Props {
  /** « 🇫🇷 Kylian Mbappé #209 · 2018 » pour un sticker d'échange */
  entryLabel: (e: { editionId: string; number: string | number }) => string;
}

const STATUS_COLOR: Record<OfferStatus, string> = {
  proposed: C.blue, accepted: C.gold, done: C.green, declined: C.textTertiary, cancelled: C.textTertiary,
};

/** Onglet « Propositions » : échanges proposés, acceptés, confirmés par chacun. */
export const TradeOffers: React.FC<Props> = ({ entryLabel }) => {
  const t = useT();
  const { offers, loading, error, loadOffers, respond, cancel, confirm } = useOffersStore();
  useEffect(() => { loadOffers(); }, []);

  const statusLabel = (o: TradeOffer) => ({
    proposed: o.mine ? t('En attente de réponse') : t('Nouvelle proposition'),
    accepted: o.iConfirmed ? t('En attente de sa confirmation') : t('Acceptée — à faire'),
    done: t('Échange terminé'),
    declined: t('Refusée'),
    cancelled: t('Annulée'),
  }[o.status]);

  const btn = (primary: boolean): React.CSSProperties => ({
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', minHeight: '40px', borderRadius: '10px',
    fontSize: '12px', fontWeight: 700, cursor: 'pointer',
    ...(primary ? { border: 'none' } : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: C.textSecondary }),
  });

  const list = (title: string, entries: TradeOffer['give'], color: string) => (
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ fontSize: '11px', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '6px' }}>{title} ({entries.length})</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', maxHeight: '120px', overflowY: 'auto' }}>
        {entries.map((e, i) => (
          <span key={i} style={{ fontSize: '11px', color: C.textSecondary, background: 'rgba(255,255,255,0.04)', borderRadius: '4px', padding: '2px 6px' }}>{entryLabel(e)}</span>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <p style={{ flex: 1, fontSize: '12px', color: C.textTertiary, lineHeight: 1.6, margin: 0 }}>
          {t("Propose un échange depuis l'onglet Comparer. Une fois les stickers échangés en vrai, chacun confirme : ta collection se met à jour toute seule.")}
        </p>
        <button className="btn-tactile" onClick={() => loadOffers()} disabled={loading} aria-label={t('Actualiser')} style={{ width: '36px', height: '36px', flexShrink: 0, borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: C.textSecondary, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RefreshCw size={15} style={loading ? { animation: 'spin 0.7s linear infinite' } : undefined} />
        </button>
      </div>

      {error && <p style={{ fontSize: '12px', color: C.redLight, margin: 0 }}>{t('Erreur : {msg}', { msg: error })}</p>}

      {offers.length === 0 && !loading && (
        <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', textAlign: 'center', fontSize: '12px', color: C.textTertiary }}>
          {t('Aucune proposition pour le moment.')}
        </div>
      )}

      {offers.map((o) => (
        <div key={o.id} style={{ background: C.bgCard, border: `1px solid ${STATUS_COLOR[o.status]}40`, borderRadius: '16px', overflow: 'hidden', opacity: o.status === 'declined' || o.status === 'cancelled' ? 0.6 : 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <ArrowLeftRight size={16} color={STATUS_COLOR[o.status]} />
            <p style={{ flex: 1, fontSize: '13px', fontWeight: 700, color: C.textPrimary, margin: 0 }}>
              {o.mine ? t('Toi → {name}', { name: o.otherName }) : t('{name} → toi', { name: o.otherName })}
            </p>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, color: STATUS_COLOR[o.status] }}>
              {o.status === 'done' ? <Check size={12} /> : <Clock size={12} />} {statusLabel(o)}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '12px', padding: '10px 16px' }}>
            {list(t('Tu donnes'), o.give, C.gold)}
            {list(t('Tu reçois'), o.receive, C.green)}
          </div>

          {(o.status === 'proposed' || o.status === 'accepted') && (
            <div style={{ display: 'flex', gap: '8px', padding: '0 16px 12px' }}>
              {o.status === 'proposed' && !o.mine && (
                <>
                  <button className="btn-tactile btn-gold" onClick={() => respond(o.id, true)} style={btn(true)}><Check size={14} /> {t('Accepter')}</button>
                  <button className="btn-tactile" onClick={() => respond(o.id, false)} style={btn(false)}><X size={14} /> {t('Refuser')}</button>
                </>
              )}
              {o.status === 'accepted' && !o.iConfirmed && (
                <button className="btn-tactile btn-gold" onClick={() => confirm(o.id)} style={btn(true)}><Check size={14} /> {t("C'est fait, mettre ma collection à jour")}</button>
              )}
              {o.mine && !(o.status === 'accepted' && o.iConfirmed) && (
                <button className="btn-tactile" onClick={() => cancel(o.id)} style={btn(false)}><X size={14} /> {t('Annuler la proposition')}</button>
              )}
            </div>
          )}
          {o.status === 'accepted' && o.otherConfirmed && !o.iConfirmed && (
            <p style={{ fontSize: '11px', color: C.textTertiary, padding: '0 16px 12px', margin: 0 }}>{t('{name} a déjà confirmé de son côté.', { name: o.otherName })}</p>
          )}
        </div>
      ))}
    </div>
  );
};
