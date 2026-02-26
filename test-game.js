/**
 * Playwright script to test the Greenlight idle game
 * Run with: node test-game.js
 */
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputDir = join(__dirname, 'test-screenshots');

const consoleLogs = [];
const consoleErrors = [];

async function runTest() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 800, height: 600 } });
  const page = await context.newPage();

  // Capture console messages
  page.on('console', (msg) => {
    const text = msg.text();
    const type = msg.type();
    if (type === 'error') {
      consoleErrors.push(text);
    }
    consoleLogs.push({ type, text });
  });

  try {
    console.log('1. Navigating to http://localhost:3009/...');
    await page.goto('http://localhost:3009/', { waitUntil: 'networkidle', timeout: 15000 });

    console.log('2. Waiting for GREENLIGHT title screen...');
    await page.waitForSelector('canvas', { timeout: 10000 });
    await page.waitForTimeout(1500);

    // Check if menu is visible (Phaser renders to canvas, so we look for text via canvas or wait)
    const hasTitle = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      return !!canvas && canvas.width > 0;
    });
    console.log('   Canvas found:', hasTitle);

    // Screenshot 1: Menu
    await page.screenshot({ path: join(outputDir, '01-menu.png') });
    console.log('3. Screenshot saved: menu screen');

    // Click New Game - Phaser renders to canvas, button at (centerX, 290) in 960x640 game
    console.log('4. Clicking New Game...');
    const canvas = await page.$('canvas');
    const box = await canvas.boundingBox();
    // Game is 960x640, New Game button at y=290; canvas may be scaled with FIT
    const clickX = box.x + box.width / 2;
    const clickY = box.y + (290 / 640) * box.height;
    await page.mouse.click(clickX, clickY);

    console.log('5. Waiting for game to load...');
    await page.waitForTimeout(1500);

    // Screenshot 2: Game screen
    await page.screenshot({ path: join(outputDir, '02-game.png') });
    console.log('6. Screenshot saved: game screen');

    // Check for tabs and pipeline panel
    const gameState = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return { canvas: false };
      const ctx = canvas.getContext('2d');
      return {
        canvas: true,
        width: canvas.width,
        height: canvas.height,
      };
    });
    console.log('   Canvas state:', gameState);

  } catch (err) {
    console.error('Test error:', err.message);
  } finally {
    await browser.close();
  }

  // Report
  console.log('\n=== REPORT ===');
  console.log('Console errors:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    consoleErrors.forEach((e, i) => console.log(`  [${i + 1}]`, e));
  }
  console.log('\nScreenshots saved to:', outputDir);
}

import { mkdirSync } from 'fs';
try {
  mkdirSync(outputDir, { recursive: true });
} catch (_) {}
runTest().catch(console.error);
