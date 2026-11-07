import { defineConfig, devices } from '@playwright/test';

// Tests de bout en bout : `npm run test:e2e`.
// Utilise Edge ou Chrome déjà installés (pas de téléchargement de navigateur).
// Mode déconnecté uniquement : aucun appel Supabase n'est nécessaire.
const PORT = 5174;

export default defineConfig({
  testDir: './e2e',
  // Le serveur de dev compile à la demande : le premier passage est lent quand tout tourne en parallèle
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  workers: process.env.CI ? 2 : undefined,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: 'fr-FR',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Edge'], channel: process.env.PW_CHANNEL ?? 'msedge' } },
    { name: 'mobile', use: { ...devices['Pixel 7'], channel: process.env.PW_CHANNEL ?? 'msedge' } },
  ],
  webServer: {
    command: `npm run dev -- --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
