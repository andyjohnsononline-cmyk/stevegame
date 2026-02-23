#!/usr/bin/env node
/**
 * Browser test script for Greenlight game
 * Run: npx playwright test-game.mjs (or node after installing playwright)
 */
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const URL = 'http://localhost:3001/';
const SCREENSHOT_DIR = join(process.cwd(), 'test-screenshots');
mkdirSync(SCREENSHOT_DIR, { recursive: true });

async function main() {
  const consoleLogs = [];
  const consoleErrors = [];

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 960, height: 640 } });
  const page = await context.newPage();

  // Capture console messages
  page.on('console', (msg) => {
    const text = msg.text();
    const type = msg.type();
    if (type === 'error') {
      consoleErrors.push(text);
    }
    consoleLogs.push(`[${type}] ${text}`);
  });

  try {
    console.log('1. Navigating to', URL);
    await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 15000 });

    // Wait for Phaser to load (BootScene shows "Loading...")
    await page.waitForTimeout(1500);

    // Screenshot 1: Title/Menu screen
    const screenshot1 = await page.screenshot({ path: join(SCREENSHOT_DIR, '01-menu.png') });
    console.log('   Screenshot saved: 01-menu.png');

    // Look for New Game button and click it
    const newGameBtn = page.locator('text=New Game').first();
    const btnExists = await newGameBtn.count() > 0;
    console.log('2. New Game button found:', btnExists);

    if (btnExists) {
      await newGameBtn.click();
      await page.waitForTimeout(2000); // Wait for GameScene to load

      // Screenshot 2: Game scene
      const screenshot2 = await page.screenshot({ path: join(SCREENSHOT_DIR, '02-game-scene.png') });
      console.log('   Screenshot saved: 02-game-scene.png');

      // Try moving with arrow keys
      console.log('3. Testing movement (arrow keys)...');
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(200);
      await page.keyboard.press('ArrowDown');
      await page.waitForTimeout(200);

      // Screenshot 3: After movement
      const screenshot3 = await page.screenshot({ path: join(SCREENSHOT_DIR, '03-after-move.png') });
      console.log('   Screenshot saved: 03-after-move.png');

      // Try WASD
      await page.keyboard.press('KeyW');
      await page.waitForTimeout(100);
      await page.keyboard.press('KeyA');
      await page.waitForTimeout(500);
    }

    // Final screenshot
    const screenshot4 = await page.screenshot({ path: join(SCREENSHOT_DIR, '04-final.png') });
    console.log('   Screenshot saved: 04-final.png');

    // Check for HUD elements
    const hasClock = await page.locator('text=/\\d{1,2}:\\d{2}/').count() > 0;
    const hasDay = await page.locator('text=/Day \\d+/').count() > 0;
    const hasEnergy = await page.locator('text=/Energy/').count() > 0;
    console.log('4. HUD check - Clock:', hasClock, 'Day:', hasDay, 'Energy:', hasEnergy);

    // Write report
    const report = {
      timestamp: new Date().toISOString(),
      url: URL,
      newGameButtonFound: btnExists,
      hud: { clock: hasClock, day: hasDay, energy: hasEnergy },
      consoleErrors,
      consoleLogs: consoleLogs.slice(-20),
    };
    writeFileSync(join(SCREENSHOT_DIR, 'report.json'), JSON.stringify(report, null, 2));
    console.log('Report saved to report.json');

    if (consoleErrors.length > 0) {
      console.log('\n--- Console Errors ---');
      consoleErrors.forEach((e) => console.log(e));
    }
  } catch (err) {
    console.error('Test error:', err.message);
    await page.screenshot({ path: join(SCREENSHOT_DIR, 'error.png') });
  } finally {
    await browser.close();
  }
}

main();
