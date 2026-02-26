/**
 * Thorough game test - stages, coins, hiring, console errors
 * Run: node test-game-thorough.js
 */
import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function runTest() {
  const results = { consoleErrors: [], flow: [], screenshots: [] };
  const screenshotDir = path.join(process.cwd(), 'test-screenshots');
  if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();

  page.on('console', msg => {
    const text = msg.text();
    const type = msg.type();
    if (type === 'error') results.consoleErrors.push(text);
  });

  // Game 960x640, FIT scale 1.125, viewport 1280x720 -> canvas offset (100,0)
  const scale = 1.125;
  const offsetX = 100;
  const centerX = offsetX + 480 * scale;  // enemy center
  const enemyY = 220 * scale;            // enemy sprite area
  const hireBtnX = offsetX + 340 * scale; // Intern HIRE at (340,440) in game
  const hireBtnY = 440 * scale;

  try {
    console.log('1. Loading game (clearing save for fresh start)...');
    await context.addInitScript(() => {
      localStorage.removeItem('greenlight_save');
    });
    await page.goto('http://localhost:5186/', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForSelector('canvas', { timeout: 10000 });
    await page.waitForTimeout(2500);

    console.log('2. Clicking Play...');
    await page.mouse.click(centerX, 295);
    await page.waitForTimeout(1500);

    console.log('3. Screenshot: initial game state');
    await page.screenshot({ path: path.join(screenshotDir, 'thorough-01-initial.png') });
    results.screenshots.push('thorough-01-initial.png');
    results.flow.push('Initial state captured');

    console.log('4. Clicking enemy ~10 times to kill first enemy...');
    for (let i = 0; i < 12; i++) {
      await page.mouse.click(centerX, enemyY);
      await page.waitForTimeout(80);
    }
    await page.waitForTimeout(800); // wait for death animation, spawn

    console.log('5. Screenshot: after first kill (Stage 2)');
    await page.screenshot({ path: path.join(screenshotDir, 'thorough-02-stage2.png') });
    results.screenshots.push('thorough-02-stage2.png');
    results.flow.push('First enemy killed, Stage 2');

    console.log('6. Clicking ~5 more times on second enemy...');
    for (let i = 0; i < 5; i++) {
      await page.mouse.click(centerX, enemyY);
      await page.waitForTimeout(100);
    }
    await page.waitForTimeout(500);

    console.log('7. Killing more enemies to get coins for Intern (need 10)...');
    // Stage 5 is BOSS (~174 HP). Need 10 coins total - stages 1-4 give 7, boss gives 40
    for (let round = 0; round < 6; round++) {
      for (let i = 0; i < 25; i++) {
        await page.mouse.click(centerX, enemyY);
        await page.waitForTimeout(45);
      }
      await page.waitForTimeout(800);
    }

    console.log('8. Screenshot: progress (stages, coins)');
    await page.screenshot({ path: path.join(screenshotDir, 'thorough-03-progress.png') });
    results.screenshots.push('thorough-03-progress.png');
    results.flow.push('Progress after multiple kills');

    console.log('9. Clicking HIRE button for Intern...');
    await page.mouse.click(hireBtnX, hireBtnY);
    await page.waitForTimeout(800);

    console.log('10. Screenshot: after hiring attempt');
    await page.screenshot({ path: path.join(screenshotDir, 'thorough-04-after-hire.png') });
    results.screenshots.push('thorough-04-after-hire.png');
    results.flow.push('After HIRE click attempt');

  } catch (err) {
    results.consoleErrors.push(`Test error: ${err.message}`);
    await page.screenshot({ path: path.join(screenshotDir, 'thorough-error.png') }).catch(() => {});
  }

  await browser.close();

  console.log('\n========== THOROUGH TEST REPORT ==========');
  console.log('Flow:', results.flow);
  console.log('Screenshots:', results.screenshots);
  console.log('Console errors:', results.consoleErrors.length ? results.consoleErrors : 'None');
  console.log('==========================================\n');

  return results;
}

runTest().catch(console.error);
