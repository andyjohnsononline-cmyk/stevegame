import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

async function capture() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 960, height: 700 } });
  
  await page.goto('http://localhost:3002/', { waitUntil: 'load', timeout: 10000 });
  await page.waitForTimeout(2000); // Let Phaser load
  
  await page.screenshot({ path: 'screenshot-title.png' });
  console.log('Saved screenshot-title.png');
  
  // Phaser renders to canvas - click at button position (center X, y=300 in 960x640 game)
  // With FIT scale, canvas is centered; viewport 960x700 gives ~30px top padding
  const canvas = page.locator('canvas');
  const box = await canvas.boundingBox();
  if (box) {
    const clickX = box.x + box.width / 2;
    const clickY = box.y + 330; // ~y=300 in game + top offset
    await page.mouse.click(clickX, clickY);
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshot-game.png' });
    console.log('Saved screenshot-game.png');
  } else {
    console.log('Canvas not found');
  }
  
  await browser.close();
}

capture().catch(console.error);
