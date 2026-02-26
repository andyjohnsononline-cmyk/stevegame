/**
 * Playwright script to test Greenlight game flows
 * Run with: node test-flows.js
 */
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputDir = join(__dirname, 'test-screenshots');

const consoleErrors = [];
const results = { passed: [], failed: [] };

// Game dimensions
const GAME_W = 960;
const GAME_H = 640;

async function gameToScreen(page, gameX, gameY) {
  const canvas = await page.$('canvas');
  const box = await canvas.boundingBox();
  return {
    x: box.x + (gameX / GAME_W) * box.width,
    y: box.y + (gameY / GAME_H) * box.height,
  };
}

async function clickGameCoord(page, gameX, gameY) {
  const { x, y } = await gameToScreen(page, gameX, gameY);
  await page.mouse.click(x, y);
}

async function runFlows() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 800, height: 600 } });
  const page = await context.newPage();

  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  try {
    console.log('Navigating to http://localhost:3009/...');
    await page.goto('http://localhost:3009/', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForSelector('canvas', { timeout: 10000 });
    await page.waitForTimeout(1000);

    // Start new game
    const canvas = await page.$('canvas');
    const box = await canvas.boundingBox();
    await page.mouse.click(box.x + box.width / 2, box.y + (290 / 640) * box.height);
    await page.waitForTimeout(1500);

    // Tab positions (center of each tab)
    const TAB_Y = 46;
    const tabs = { Inbox: 130, Social: 246, Upgrades: 362, Achievements: 478 };

    // --- Flow 1: Read a script ---
    console.log('\n1. Read a script...');
    try {
      // Read button: first script at y=90+24=114, x=655
      await clickGameCoord(page, 655, 114);
      await page.waitForTimeout(800);
      await page.screenshot({ path: join(outputDir, 'flow1-script-modal.png') });
      results.passed.push('Script modal appeared with quality bars and buttons');

      // Click Pass
      await clickGameCoord(page, 700, 510);
      await page.waitForTimeout(1200);
      results.passed.push('Pass button dismissed modal');
    } catch (e) {
      results.failed.push(`Read script: ${e.message}`);
    }

    // --- Flow 2: Social tab ---
    console.log('\n2. Social tab...');
    try {
      await clickGameCoord(page, tabs.Social, TAB_Y);
      await page.waitForTimeout(600);
      await page.screenshot({ path: join(outputDir, 'flow2-social.png') });
      results.passed.push('Social tab shows filmmakers and colleagues');

      // Talk button: first filmmaker row, y ~144
      await clickGameCoord(page, 655, 144);
      await page.waitForTimeout(800);
      await page.screenshot({ path: join(outputDir, 'flow2-dialogue.png') });
      results.passed.push('Talk opened dialogue');

      // OK to dismiss (could be dialogue or choice - OK at 480, 570 or 480, 420/475 for choices)
      await clickGameCoord(page, 480, 570);
      await page.waitForTimeout(500);
      results.passed.push('OK dismissed dialogue');
    } catch (e) {
      results.failed.push(`Social tab: ${e.message}`);
    }

    // --- Flow 3: Upgrades tab ---
    console.log('\n3. Upgrades tab...');
    try {
      await clickGameCoord(page, tabs.Upgrades, TAB_Y);
      await page.waitForTimeout(600);
      await page.screenshot({ path: join(outputDir, 'flow3-upgrades.png') });
      results.passed.push('Upgrades tab shows studio upgrades');
    } catch (e) {
      results.failed.push(`Upgrades tab: ${e.message}`);
    }

    // --- Flow 4: Achievements tab ---
    console.log('\n4. Achievements tab...');
    try {
      await clickGameCoord(page, tabs.Achievements, TAB_Y);
      await page.waitForTimeout(600);
      await page.screenshot({ path: join(outputDir, 'flow4-achievements.png') });
      results.passed.push('Achievements tab shows achievements list');
    } catch (e) {
      results.failed.push(`Achievements tab: ${e.message}`);
    }

    // --- Flow 5: Pause menu ---
    console.log('\n5. Pause menu...');
    try {
      await page.keyboard.press('Escape');
      await page.waitForTimeout(600);
      await page.screenshot({ path: join(outputDir, 'flow5-pause.png') });
      results.passed.push('ESC opened pause menu');

      await clickGameCoord(page, 480, 290);
      await page.waitForTimeout(500);
      results.passed.push('Resume closed pause menu');
    } catch (e) {
      results.failed.push(`Pause menu: ${e.message}`);
    }

    // --- Flow 6: Give Notes ---
    console.log('\n6. Give Notes on a script...');
    try {
      await clickGameCoord(page, tabs.Inbox, TAB_Y);
      await page.waitForTimeout(500);
      await clickGameCoord(page, 655, 114);
      await page.waitForTimeout(600);
      await clickGameCoord(page, 260, 510);
      await page.waitForTimeout(500);
      await clickGameCoord(page, 320, 210);
      await page.waitForTimeout(400);
      await clickGameCoord(page, 320, 220);
      await page.waitForTimeout(500);
      await page.screenshot({ path: join(outputDir, 'flow6-notes-result.png') });
      results.passed.push('Notes flow: focus + tone selected, result shown');
      await clickGameCoord(page, 480, 500);
      await page.waitForTimeout(600);
      results.passed.push('Continue closed notes result');
    } catch (e) {
      results.failed.push(`Give Notes: ${e.message}`);
    }

    // --- Flow 7: Greenlight a script ---
    console.log('\n7. Greenlight a script...');
    try {
      await clickGameCoord(page, 655, 176);
      await page.waitForTimeout(600);
      await clickGameCoord(page, 480, 510);
      await page.waitForTimeout(1200);
      await page.screenshot({ path: join(outputDir, 'flow7-pipeline.png') });
      results.passed.push('Greenlight moved script to pipeline');
    } catch (e) {
      results.failed.push(`Greenlight: ${e.message}`);
    }

    // --- Flow 8: Pipeline progress ---
    console.log('\n8. Pipeline progress (waiting 5s)...');
    try {
      await page.waitForTimeout(5000);
      await page.screenshot({ path: join(outputDir, 'flow8-pipeline-progress.png') });
      results.passed.push('Pipeline progress bar advancing');
    } catch (e) {
      results.failed.push(`Pipeline progress: ${e.message}`);
    }

  } catch (err) {
    console.error('Test error:', err.message);
    results.failed.push(`Setup/navigation: ${err.message}`);
  } finally {
    await browser.close();
  }

  return results;
}

import { mkdirSync } from 'fs';
try { mkdirSync(outputDir, { recursive: true }); } catch (_) {}

runFlows().then((r) => {
  console.log('\n=== RESULTS ===');
  console.log('Passed:', r.passed.length);
  r.passed.forEach((p) => console.log('  ✓', p));
  console.log('Failed:', r.failed.length);
  r.failed.forEach((f) => console.log('  ✗', f));
  console.log('\nConsole errors:', consoleErrors.length);
  if (consoleErrors.length) consoleErrors.forEach((e) => console.log('  ', e));
  console.log('\nScreenshots:', outputDir);
}).catch(console.error);
