import { test, expect, type Page } from '@playwright/test';

// Chaque test part d'un navigateur vierge : visite guidée déjà vue, interface en français.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('paninibase-onboarding-seen', '1');
    localStorage.setItem('paninibase-lang', JSON.stringify({ state: { lang: 'fr' }, version: 0 }));
  });
  await page.goto('/');
});

const openAlbum2026 = async (page: Page) => {
  await page.getByRole('button', { name: /Ouvrir l'album .*2026/ }).first().click();
  await expect(page.getByRole('button', { name: /possédés/ })).toBeVisible();
};

const ownedCount = (page: Page) => page.getByRole('button', { name: /possédés/ });

test('cocher un sticker depuis le détail', async ({ page }) => {
  await openAlbum2026(page);
  await expect(ownedCount(page)).toContainText('0');
  await page.locator('[data-sticker]').first().click();
  await page.getByRole('button', { name: '+ Ajouter' }).last().click();
  await expect(ownedCount(page)).toContainText('1');
});

test('mode scan : deux stickers cochés à la suite, puis annulation', async ({ page }) => {
  await openAlbum2026(page);
  await page.getByRole('button', { name: 'Ouvrir le mode scan rapide' }).click();
  const have = page.getByLabel('Marquer comme possédé');
  await have.click();
  await page.waitForTimeout(350); // animation de la carte
  await have.click();
  await page.waitForTimeout(350);
  await page.getByLabel('Revenir au sticker précédent').click();
  await page.keyboard.press('Escape');
  await expect(ownedCount(page)).toContainText('1');
});

test('recherche globale : ouvre le sticker trouvé', async ({ page, isMobile }) => {
  if (isMobile) await page.getByRole('button', { name: 'Rechercher un joueur' }).click();
  await page.getByRole('textbox', { name: /Rechercher un joueur/ }).fill('Mbapp');
  await page.getByRole('button', { name: /^USA\/Canada\/Mexique 2026/ }).first().click(); // un résultat, pas une carte d'album
  await expect(page.getByRole('button', { name: /possédés/ })).toBeVisible();
  // Sur mobile le panneau latéral est masqué : on vise la fiche visible (feuille du bas)
  await expect(page.getByText(/Kylian Mbapp/).locator('visible=true').first()).toBeVisible();
});

test('copier la liste des manquants / doublons', async ({ page, context, browserName, isMobile }) => {
  test.skip(browserName !== 'chromium' || isMobile, 'presse-papier lu seulement sur Chromium desktop');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await openAlbum2026(page);
  await page.getByRole('button', { name: "Plus d'actions" }).click();
  await page.getByRole('menuitem', { name: /Copier manquants/ }).click();
  await expect(page.getByRole('status')).toContainText('Liste copiée');
  const text = await page.evaluate(() => navigator.clipboard.readText());
  expect(text).toMatch(/^PaniniBase · .*2026\r?\nIl me manque \(\d+\) : /); // Windows : \r\n
});

test('progression par équipe : filtre l\'album sur l\'équipe choisie', async ({ page }) => {
  await openAlbum2026(page);
  await page.getByRole('button', { name: "Plus d'actions" }).click();
  await page.getByRole('menuitem', { name: 'Progression par équipe' }).click();
  const dialog = page.getByRole('dialog', { name: 'Progression par équipe' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: /France/ }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByRole('button', { name: /Ouvrir les filtres/ })).toContainText('1');
});

test('échanges sans compte : invite à se connecter', async ({ page, isMobile }) => {
  const nav = isMobile ? page.locator('.mobile-nav') : page.locator('header');
  await nav.getByRole('button', { name: /Échanges/ }).click();
  await expect(page.getByRole('heading', { name: 'Mode Échange' })).toBeVisible();
  await page.getByRole('button', { name: 'Se connecter' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
});

test('changer de langue', async ({ page }) => {
  await page.getByRole('button', { name: /Langue|Language|Idioma/ }).first().click();
  await page.getByRole('menuitemradio', { name: /English/ }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});
