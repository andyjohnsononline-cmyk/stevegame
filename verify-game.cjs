const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 960, height: 640 } });
  const page = await context.newPage();

  const consoleLogs = [];
  const consoleErrors = [];
  page.on('console', msg => {
    const text = msg.text();
    const type = msg.type();
    if (type === 'error') {
      consoleErrors.push(text);
    }
    consoleLogs.push(`[${type}] ${text}`);
  });

  const url = process.env.GAME_URL || 'http://localhost:3002/';
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 15000 });
  } catch (e) {
    console.log('NAV_ERROR:', e.message);
    await browser.close();
    process.exit(1);
  }

  await page.waitForTimeout(1500);

  await page.screenshot({ path: path.join(__dirname, 'screenshot-title.png') });

  const hasGreenlight = await page.locator('text=GREENLIGHT').count() > 0;
  const hasNewGame = await page.locator('text=New Game').count() > 0;

  if (hasGreenlight && hasNewGame) {
    await page.click('text=New Game');
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(__dirname, 'screenshot-game.png') });
  }

  console.log('=== CONSOLE LOGS ===');
  consoleLogs.forEach(l => console.log(l));
  console.log('\n=== CONSOLE ERRORS ===');
  consoleErrors.forEach(e => console.log(e));
  console.log('\n=== SUMMARY ===');
  console.log('Title screen (GREENLIGHT):', hasGreenlight);
  console.log('New Game button:', hasNewGame);
  console.log('Error count:', consoleErrors.length);

  await browser.close();
})();
