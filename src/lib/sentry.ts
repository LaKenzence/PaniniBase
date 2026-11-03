/**
 * Suivi d'erreurs Sentry, chargé à la demande.
 * Le SDK (~100 Ko) n'est téléchargé qu'en prod et seulement si VITE_SENTRY_DSN
 * est défini : il ne pèse plus sur le premier chargement de l'app.
 */
const DSN = import.meta.env.VITE_SENTRY_DSN as string | undefined;
const enabled = import.meta.env.PROD && !!DSN;

let sentry: Promise<typeof import('@sentry/react')> | null = null;

const load = () => {
  if (!sentry) {
    sentry = import('@sentry/react').then((S) => {
      S.init({ dsn: DSN, tracesSampleRate: 0.1 });
      return S;
    });
  }
  return sentry;
};

export function initSentry() {
  if (enabled) load().catch(() => {});
}

export function captureException(error: unknown, extra?: Record<string, unknown>) {
  if (enabled) load().then((S) => S.captureException(error, { extra })).catch(() => {});
}
