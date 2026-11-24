import React from 'react';
import { captureException } from '../lib/sentry';
import { C } from '../theme';
import { t } from '../i18n';

interface State {
  hasError: boolean;
}

/**
 * Capture toute erreur React non gérée dans l'arbre des composants et affiche
 * un écran de secours au lieu d'une page blanche. Sans ça, un bug imprévu
 * n'importe où dans l'app plante tout pour l'utilisateur sans aucune explication.
 */
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.error('PaniniBase — erreur non gérée :', error, info);
    captureException(error, { componentStack: (info as any)?.componentStack });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: C.bgBase, color: C.textPrimary, padding: '24px', textAlign: 'center', fontFamily: 'Inter, system-ui, sans-serif',
        }}>
          <img src="/logo.svg" alt="" style={{ width: '56px', height: '56px', borderRadius: '14px', marginBottom: '20px', opacity: 0.8 }} />
          <h1 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>{t("Oups, quelque chose s'est mal passé")}</h1>
          <p style={{ fontSize: '13px', color: C.textSecondary, marginBottom: '24px', maxWidth: '320px', lineHeight: 1.6 }}>
            {t('Une erreur inattendue est survenue. Recharge la page — ta collection est sauvegardée, tu ne perdras rien.')}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: '11px 24px', borderRadius: '10px', background: C.gold, color: '#000', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer' }}
          >
            {t('↻ Recharger la page')}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
