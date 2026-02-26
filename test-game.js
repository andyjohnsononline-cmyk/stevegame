/**
 * Manual test script for the game - navigates, takes screenshots, reports findings
 * Run with: node test-game.js
 */
import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runTest() {
  const results = {
    menuLook: null,
    gameScreenLoad: null,
    clicksDamage: null,
    errors: [],
    layoutIssues: [],
    consoleLogs: []
  };

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();

  // Capture console messages
  page.on('console', msg => {
    const text = msg.text();
    const type = msg.type();
    results.consoleLogs.push({ type, text });
    if (type === 'error') results.errors.push(`Console: ${text}`);
  });

  try {
    console.log('1. Navigating to http://localhost:5186/...');
    await page.goto('http://localhost:5186/', { waitUntil: 'networkidle', timeout: 15000 });

    // Phaser canvas game - wait for canvas to appear and loading to finish
    console.log('2. Waiting for game canvas...');
    await page.waitForSelector('canvas', { timeout: 10000 });
    await page.waitForTimeout(2500); // BootScene shows "Loading..." then MenuScene

    const screenshotDir = path.join(process.cwd(), 'test-screenshots');
    if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

    console.log('3. Taking screenshot of menu...');
    await page.screenshot({ path: path.join(screenshotDir, '01-menu.png'), fullPage: true });
    results.menuLook = 'Screenshot saved to test-screenshots/01-menu.png';

    // Menu is canvas - we have screenshot
    results.menuLook = (results.menuLook || '') + ' - Canvas menu (STUDIO LOT, Play/Continue)';

    console.log('4. Clicking Play/Continue button (center, ~260px in game coords)...');
    // Game 960x640, FIT scale. Button at (480, 260). Viewport 1280x720 -> canvas ~1080x720 centered
    const vp = await page.viewportSize();
    const btnScreenX = vp.width / 2;
    const btnScreenY = vp.height * 0.41; // ~260/640
    await page.mouse.click(btnScreenX, btnScreenY);
    await page.waitForTimeout(1500);

    console.log('5. Taking screenshot of game screen...');
    await page.screenshot({ path: path.join(screenshotDir, '02-game-screen.png'), fullPage: true });

    // Game is canvas - check canvas exists and took screenshot
    const canvasCount = await page.locator('canvas').count();
    results.gameScreenLoad = `Canvas visible: ${canvasCount > 0}. Screenshot: test-screenshots/02-game-screen.png`;

    console.log('6. Clicking on enemy area (upper-center)...');
    // Click in upper-center - typically enemy is there
    const { width, height } = await page.evaluate(() => ({ width: window.innerWidth, height: window.innerHeight }));
    const clickX = width / 2;
    const clickY = height * 0.35;
    for (let i = 0; i < 5; i++) {
      await page.mouse.click(clickX, clickY);
      await page.waitForTimeout(200);
    }
    await page.waitForTimeout(500);

    console.log('7. Taking screenshot after clicks...');
    await page.screenshot({ path: path.join(screenshotDir, '03-after-clicks.png'), fullPage: true });
    results.clicksDamage = 'Clicks performed in upper-center. Screenshot: test-screenshots/03-after-clicks.png';

  } catch (err) {
    results.errors.push(`Test error: ${err.message}`);
    console.error('Test error:', err);
    await page.screenshot({ path: path.join(process.cwd(), 'test-screenshots', 'error.png') }).catch(() => {});
  }

  await browser.close();

  // Report
  console.log('\n========== TEST REPORT ==========');
  console.log('Menu:', results.menuLook);
  console.log('Game screen:', results.gameScreenLoad);
  console.log('Clicks/Damage:', results.clicksDamage);
  console.log('Errors:', results.errors.length ? results.errors : 'None');
  const consoleErrors = results.consoleLogs.filter(l => l.type === 'error');
  console.log('Console errors:', consoleErrors.length ? consoleErrors.map(e => e.text) : 'None');
  console.log('================================\n');

  return results;
}

runTest().catch(console.error);
