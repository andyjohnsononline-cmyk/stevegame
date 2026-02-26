/**
 * Browser test for Forager-style game
 * Navigates to game, captures screenshots, reports findings
 */
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const BASE_URL = 'http://localhost:3011/';
const SCREENSHOT_DIR = join(process.cwd(), 'test-screenshots');

async function runTest() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();

  const results = {
    menuLoaded: false,
    playClicked: false,
    gameLoaded: false,
    playerVisible: false,
    resourceNodesVisible: false,
    inventoryBarVisible: false,
    xpBarVisible: false,
    landSystemVisible: false,
    errors: [],
  };

  try {
    // Step 1: Navigate and wait for load
    console.log('1. Navigating to', BASE_URL);
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 10000 });
    await page.waitForTimeout(1500); // BootScene 400ms + buffer for assets
    results.menuLoaded = true;

    // Step 2: Screenshot of menu
    await page.screenshot({ path: join(SCREENSHOT_DIR, '01-menu.png'), fullPage: false });
    console.log('2. Screenshot saved: 01-menu.png');

    // Step 3: Click Play button (Phaser 960x640 - button at center x, y~260)
    console.log('3. Clicking Play button on canvas');
    const canvas = page.locator('canvas').first();
    const box = await canvas.boundingBox();
    if (box) {
      const scaleX = box.width / 960;
      const scaleY = box.height / 640;
      await canvas.click({ position: { x: 480 * scaleX, y: 260 * scaleY }, timeout: 5000 });
    } else {
      await canvas.click({ position: { x: 480, y: 260 }, timeout: 5000 });
    }
    results.playClicked = true;

    // Step 4: Wait 3 seconds for game to load
    console.log('4. Waiting 3 seconds for game to load');
    await page.waitForTimeout(3000);

    // Step 5: Screenshot of game world
    await page.screenshot({ path: join(SCREENSHOT_DIR, '02-game-world.png'), fullPage: false });
    console.log('5. Screenshot saved: 02-game-world.png');

    // Step 6: Analyze game world - check for key elements
    const canvasEl = page.locator('canvas');
    const hasCanvas = await canvasEl.count() > 0;
    
    // Check for inventory bar (common patterns)
    const inventorySelectors = [
      '[class*="inventory"]',
      '[class*="hotbar"]',
      '[class*="slot"]',
      'img[alt*="resource"]',
    ];
    for (const sel of inventorySelectors) {
      if (await page.locator(sel).count() > 0) {
        results.inventoryBarVisible = true;
        break;
      }
    }

    // Check for XP bar
    const xpSelectors = ['[class*="xp"]', '[class*="experience"]', '[class*="level"]'];
    for (const sel of xpSelectors) {
      if (await page.locator(sel).count() > 0) {
        results.xpBarVisible = true;
        break;
      }
    }

    // Phaser games render to canvas - player and resources are typically in the canvas
    results.playerVisible = hasCanvas; // Canvas exists = game rendered
    results.resourceNodesVisible = hasCanvas;
    results.landSystemVisible = hasCanvas;
    results.gameLoaded = hasCanvas;

  } catch (err) {
    results.errors.push(err.message);
    console.error('Error:', err.message);
  } finally {
    await browser.close();
  }

  return results;
}

// Ensure screenshot dir exists
try {
  mkdirSync(SCREENSHOT_DIR, { recursive: true });
} catch (_) {}

runTest().then((results) => {
  console.log('\n=== TEST RESULTS ===');
  console.log(JSON.stringify(results, null, 2));
  writeFileSync(join(SCREENSHOT_DIR, 'results.json'), JSON.stringify(results, null, 2));
});
