import React, { useState, useEffect } from 'react';
import { Mail, AlertTriangle, X } from 'lucide-react';
import { useAuthStore } from '../store/index';
import { C } from '../theme';
import { useT } from '../i18n';

interface Props { onClose: () => void; }

const Field: React.FC<{
  label: string; placeholder: string; value: string;
  type?: string; onChange: (v: string) => void; onEnter?: () => void;
}> = ({ label, placeholder, value, type = 'text', onChange, onEnter }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{
        display: 'block', fontSize: '11px', fontWeight: 700,
        color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '8px'
      }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={(e) => e.key === 'Enter' && onEnter?.()}
        style={{
          display: 'block',
          width: '100%',
          padding: '13px 16px',
          borderRadius: '12px',
          border: `2px solid ${focused ? C.gold : 'rgba(255,255,255,0.1)'}`,
          background: focused ? 'rgba(201,162,39,0.05)' : 'rgba(255,255,255,0.04)',
          color: C.textPrimary,
          fontSize: '14px',
          outline: 'none',
          transition: 'border-color 0.15s, background 0.15s',
          boxSizing: 'border-box',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      />
    </div>
  );
};

export const AuthModal: React.FC<Props> = ({ onClose }) => {
  const { signInEmail, signUpEmail } = useAuthStore();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const t = useT();

  // Échap pour fermer, cohérent avec le reste de l'app
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSubmit = async () => {
    setError(null);
    if (!email.trim() || !password.trim()) { setError(t('Email et mot de passe requis')); return; }
    if (mode === 'signup' && !username.trim()) { setError(t('Pseudo requis')); return; }
    setLoading(true);
    let err: string | null = null;
    if (mode === 'login') {
      err = await signInEmail(email, password);
    } else {
      err = await signUpEmail(email, password, username);
      if (!err) { setSuccess(true); setLoading(false); return; }
    }
    if (err) setError(err);
    else onClose();
    setLoading(false);
  };

  const overlay: React.CSSProperties = {
    position: 'fixed', inset: 0, zIndex: 100,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '16px',
    background: 'rgba(4,8,20,0.88)',
    backdropFilter: 'blur(16px)',
  };

  if (success) return (
    <div style={overlay} role="dialog" aria-modal="true" aria-label={t('Vérifie tes emails')}>
      <div style={{ background: C.bgCard, border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '48px 36px', maxWidth: '380px', width: '100%', textAlign: 'center' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(46,204,113,0.12)', border: '2px solid rgba(46,204,113,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: C.green }}><Mail size={32} /></div>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: C.textPrimary, marginBottom: '10px' }}>{t('Vérifie tes emails')}</h2>
        <p style={{ fontSize: '14px', color: C.textSecondary, lineHeight: 1.6, marginBottom: '28px' }}>
          {t('Lien envoyé à')} <strong style={{ color: C.textPrimary }}>{email}</strong>
        </p>
        <button onClick={onClose} style={{ padding: '13px 32px', borderRadius: '12px', background: C.gold, color: '#000', fontWeight: 800, fontSize: '14px', border: 'none', cursor: 'pointer' }}>
          {t('Fermer')}
        </button>
      </div>
    </div>
  );

  return (
    <div style={overlay} role="dialog" aria-modal="true" aria-label={t('Connexion')} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{
        width: '100%', maxWidth: '440px',
        background: C.bgCard,
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
      }}>

        {/* ── TOP BAND ── */}
        <div style={{
          padding: '32px 36px 28px',
          background: `linear-gradient(160deg, #0F1E3A 0%, ${C.bgCard} 100%)`,
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          position: 'relative',
        }}>
          {/* Gold accent line */}
          <div style={{ position: 'absolute', top: 0, left: '36px', right: '36px', height: '2px', background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`, borderRadius: '0 0 2px 2px' }} />

          {/* Close */}
          <button onClick={onClose} style={{
            position: 'absolute', top: '20px', right: '20px',
            width: '30px', height: '30px', borderRadius: '8px',
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
            color: C.textTertiary,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><X size={16} /></button>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <img src="/logo.svg" alt="" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
            <span style={{ fontSize: '19px', fontWeight: 800, letterSpacing: '-0.5px', color: C.textPrimary }}>
              Panini<span style={{ color: C.gold }}>Base</span>
            </span>
          </div>

          <h2 style={{ fontSize: '28px', fontWeight: 800, color: C.textPrimary, letterSpacing: '-0.8px', lineHeight: 1.1, marginBottom: '8px' }}>
            {mode === 'login' ? t('Bon retour 👋') : t('Rejoins-nous 🎉')}
          </h2>
          <p style={{ fontSize: '14px', color: C.textSecondary, lineHeight: 1.5 }}>
            {mode === 'login'
              ? t('Connecte-toi pour retrouver ta collection')
              : t('Crée ton compte et commence à collectionner')}
          </p>
        </div>

        {/* ── BODY ── */}
        <div style={{ padding: '28px 36px 36px' }}>

          {/* Toggle connexion / inscription */}
          <div style={{
            display: 'flex', gap: '4px', padding: '4px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            marginBottom: '28px',
          }}>
            {(['login', 'signup'] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(null); }}
                style={{
                  flex: 1, padding: '10px', borderRadius: '9px',
                  fontSize: '13px', fontWeight: mode === m ? 700 : 400,
                  color: mode === m ? C.textPrimary : C.textTertiary,
                  background: mode === m ? '#1A2744' : 'transparent',
                  border: mode === m ? '1px solid rgba(255,255,255,0.12)' : '1px solid transparent',
                  cursor: 'pointer', transition: 'all 0.15s',
                  boxShadow: mode === m ? '0 2px 8px rgba(0,0,0,0.4)' : 'none',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                {m === 'login' ? t('Connexion') : t('Inscription')}
              </button>
            ))}
          </div>

          {/* Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '24px' }}>
            {mode === 'signup' && (
              <Field label={t('Pseudo')} placeholder={t('ton_pseudo')} value={username} onChange={setUsername} />
            )}
            <Field label={t('Email')} type="email" placeholder={t('toi@email.com')} value={email} onChange={setEmail} />
            <Field label={t('Mot de passe')} type="password" placeholder="••••••••" value={password} onChange={setPassword} onEnter={handleSubmit} />
          </div>

          {/* Error */}
          {error && (
            <div style={{
              marginBottom: '20px', padding: '13px 16px', borderRadius: '12px',
              background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.18)',
              fontSize: '13px', color: C.redLight,
              display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <AlertTriangle size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-2px' }} /> {error}
            </div>
          )}

          {/* Submit */}
          <button
            className="btn-tactile"
            onClick={handleSubmit}
            disabled={loading}
            style={{
              display: 'block', width: '100%', padding: '15px',
              borderRadius: '12px',
              background: loading ? 'rgba(201,162,39,0.35)' : C.gold,
              color: loading ? 'rgba(0,0,0,0.5)' : '#000',
              fontWeight: 800, fontSize: '15px',
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s',
              letterSpacing: '0.3px',
              fontFamily: 'Inter, system-ui, sans-serif',
              boxSizing: 'border-box',
            }}
          >
            {loading ? '...' : mode === 'login' ? t('→ Se connecter') : t('🎉 Créer mon compte')}
          </button>

          <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: C.textTertiary }}>
            {t('Tes données sont sécurisées · Aucune CB requise')}
          </p>
        </div>
      </div>
    </div>
  );
};
