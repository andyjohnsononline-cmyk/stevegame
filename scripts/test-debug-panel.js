/**
 * Playwright script to test the Greenlight debug panel.
 * Run with: npx playwright test scripts/test-debug-panel.js
 * Or: node -e "require('playwright').chromium.launch().then(b=>b.newPage().then(p=>p.goto('http://localhost:3008/').then(()=>p.waitForTimeout(3000))))"
 *
 * Simpler: npx playwright test --config=- -e "
 *   test('debug panel', async ({ page }) => {
 *     await page.goto('http://localhost:3008/');
 *     ...
 *   });
 * "
 *
 * Using playwright's run mode:
 */
import { chromium } from 'playwright';

async function getCanvasClickCoords(page, gameX, gameY) {
  return page.evaluate(({ gx, gy }) => {
    const container = document.querySelector('#game-container');
    if (!container) return null;
    const canvas = container.querySelector('canvas');
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const w = 960, h = 640;
    const scale = Math.min(rect.width / w, rect.height / h);
    const offsetX = (rect.width - w * scale) / 2;
    const offsetY = (rect.height - h * scale) / 2;
    return {
      x: rect.left + offsetX + gx * scale,
      y: rect.top + offsetY + gy * scale,
    };
  }, { gx: gameX, gy: gameY });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setViewportSize({ width: 1000, height: 700 });

  try {
    console.log('1. Navigating to http://localhost:3008/');
    await page.goto('http://localhost:3008/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    console.log('2. Looking for New Game button...');
    const newGamePos = await getCanvasClickCoords(page, 480, 290);
    if (newGamePos) {
      await page.mouse.click(newGamePos.x, newGamePos.y);
      console.log('   Clicked New Game at', newGamePos);
    } else {
      console.log('   Could not find canvas - trying center click');
      await page.mouse.click(500, 350);
    }
    await page.waitForTimeout(3000);

    console.log('3. Pressing backtick to open debug panel');
    await page.keyboard.press('`');
    await page.waitForTimeout(500);

    console.log('4. Taking screenshot (debug-panel-open.png)');
    await page.screenshot({ path: 'debug-panel-open.png' });

    console.log('5. Clicking +100 budget button (L+135, economy row)');
    const L = 301;
    const economyY = 218 + 7;
    const plus100 = await getCanvasClickCoords(page, L + 135, economyY);
    if (plus100) await page.mouse.click(plus100.x, plus100.y);
    await page.waitForTimeout(300);

    console.log('6. Clicking "3" for first character relationship');
    const firstCharY = 77 + 7;
    const rel3 = await getCanvasClickCoords(page, L + 120 + 32, firstCharY);
    if (rel3) await page.mouse.click(rel3.x, rel3.y);
    await page.waitForTimeout(300);

    console.log('7. Taking screenshot (debug-panel-updated.png)');
    await page.screenshot({ path: 'debug-panel-updated.png' });

    console.log('8. Pressing backtick to close debug panel');
    await page.keyboard.press('`');
    await page.waitForTimeout(500);

    console.log('Done! Screenshots saved: debug-panel-open.png, debug-panel-updated.png');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await browser.close();
  }
}

main();
