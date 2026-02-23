const PALETTE = {
  warmOrange: 0xE8913A,
  deepBlue: 0x2B4570,
  warmBrown: 0x8B6914,
  cream: 0xFFF5E1,
  darkWood: 0x5C3A1E,
  water: 0x4A90D9,
  waterDark: 0x3A7BC8,
  waterLight: 0x6BB0F0,
  waterHighlight: 0x9ED4FF,
  grass: 0x7CB342,
  grassDark: 0x558B2F,
  grassLight: 0x9CCC65,
  stone: 0x9E9E9E,
  stoneLight: 0xBDBDBD,
  stoneDark: 0x757575,
  brick: 0xC75B39,
  brickDark: 0xA0452C,
  brickLight: 0xD4735A,
  roofTile: 0x8B4513,
  windowGlow: 0xFFE082,
  doorColor: 0x6D4C41,
  skyDay: 0x87CEEB,
  skyEvening: 0xFF7043,
  skyNight: 0x1A1A2E,
  uiPanel: 0x2D2D44,
  uiPanelLight: 0x3D3D54,
  uiBorder: 0xE8913A,
  uiText: 0xFFF5E1,
  heartFull: 0xFF4081,
  heartEmpty: 0x555555,
  energyFull: 0x66BB6A,
  energyEmpty: 0x333333,
  highlight: 0xFFD54F,
  mapWater: 0x5B9BD5,
  mapLand: 0xD5C4A1,
  mapPath: 0xB0A080,
  mapBuilding: 0x8B7355,
};

function createTexture(scene, key, width, height, drawFn) {
  const g = scene.make.graphics({ add: false });
  drawFn(g);
  g.generateTexture(key, width, height);
  g.destroy();
}

function seededRand(seed) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return (s >> 16) / 32768;
  };
}

function ditherPixels(g, x, y, w, h, color, density, seed) {
  const rng = seededRand(seed);
  g.fillStyle(color);
  for (let py = y; py < y + h; py += 2) {
    for (let px = x; px < x + w; px += 2) {
      if (rng() < density) g.fillRect(px, py, 1, 1);
    }
  }
}

function drawCharacter(g, hairColor, skinColor, shirtColor, legOffset) {
  g.fillStyle(skinColor);
  g.fillRect(3, 1, 10, 9);
  g.fillRect(5, 0, 6, 1);

  g.fillStyle(hairColor);
  g.fillRect(3, 0, 10, 4);
  g.fillRect(5, 0, 6, 1);
  g.fillRect(3, 4, 3, 3);
  g.fillRect(10, 4, 3, 3);

  g.fillStyle(0x1A1A1A);
  g.fillRect(5, 5, 2, 2);
  g.fillRect(9, 5, 2, 2);
  g.fillStyle(0xFFFFFF);
  g.fillRect(5, 5, 1, 1);
  g.fillRect(9, 5, 1, 1);

  g.fillStyle(shirtColor);
  g.fillRect(2, 10, 12, 14);
  g.fillRect(1, 12, 1, 8);
  g.fillRect(14, 12, 1, 8);

  const trouser = 0x3D3D5C;
  g.fillStyle(trouser);
  const lo = legOffset ?? 0;
  g.fillRect(3 + lo, 24, 4, 8);
  g.fillRect(9 - lo, 24, 4, 8);

  g.fillStyle(0x2A2A2A);
  g.fillRect(3 + lo, 30, 4, 2);
  g.fillRect(9 - lo, 30, 4, 2);
}

export class TextureGenerator {
  static generateCharacterFrames(scene, key, hairColor, skinColor, shirtColor) {
    createTexture(scene, key, 16, 32, (g) => drawCharacter(g, hairColor, skinColor, shirtColor, 0));
    createTexture(scene, `${key}_walk_1`, 16, 32, (g) => drawCharacter(g, hairColor, skinColor, shirtColor, 2));
    createTexture(scene, `${key}_walk_2`, 16, 32, (g) => drawCharacter(g, hairColor, skinColor, shirtColor, -2));
  }

  static generateAll(scene) {
    // ========== TILE TEXTURES (32x32) ==========

    createTexture(scene, 'tile_wood_floor', 32, 32, (g) => {
      g.fillStyle(0x7A5C14);
      g.fillRect(0, 0, 32, 32);
      const planks = [
        { x: 0, w: 7, base: 0x8B6914 },
        { x: 8, w: 7, base: 0x9A7A1A },
        { x: 16, w: 7, base: 0x856212 },
        { x: 24, w: 8, base: 0x8B6914 },
      ];
      for (const p of planks) {
        g.fillStyle(p.base);
        g.fillRect(p.x, 0, p.w, 32);
        g.fillStyle(0x6B5210);
        g.fillRect(p.x, 0, 1, 32);
        g.fillStyle(0x9A8520);
        g.fillRect(p.x + 1, 0, 1, 32);
        ditherPixels(g, p.x + 2, 0, p.w - 3, 32, 0x7A6212, 0.15, p.x * 17);
        ditherPixels(g, p.x + 2, 0, p.w - 3, 32, 0xA08A22, 0.08, p.x * 31);
      }
      g.fillStyle(0x6B5210);
      g.fillRect(10, 8, 3, 3);
      g.fillRect(22, 20, 2, 2);
    });

    createTexture(scene, 'tile_carpet', 32, 32, (g) => {
      g.fillStyle(0x722F37);
      g.fillRect(0, 0, 32, 32);
      ditherPixels(g, 0, 0, 32, 32, 0x8A3740, 0.2, 42);
      ditherPixels(g, 0, 0, 32, 32, 0x5C252C, 0.1, 99);
      g.fillStyle(0x5C252C);
      g.fillRect(0, 0, 32, 2);
      g.fillRect(0, 30, 32, 2);
      g.fillRect(0, 0, 2, 32);
      g.fillRect(30, 0, 2, 32);
      g.fillStyle(0x9A4550);
      g.fillRect(2, 2, 28, 1);
      g.fillRect(2, 2, 1, 28);
    });

    createTexture(scene, 'tile_stone_floor', 32, 32, (g) => {
      g.fillStyle(PALETTE.stone);
      g.fillRect(0, 0, 32, 32);
      g.fillStyle(PALETTE.stoneLight);
      g.fillRect(1, 1, 14, 14);
      g.fillRect(17, 17, 14, 14);
      g.fillStyle(PALETTE.stoneDark);
      g.fillRect(0, 0, 32, 1);
      g.fillRect(0, 16, 32, 1);
      g.fillRect(0, 0, 1, 32);
      g.fillRect(16, 0, 1, 32);
      ditherPixels(g, 0, 0, 32, 32, 0x8E8E8E, 0.1, 55);
    });

    createTexture(scene, 'tile_grass', 32, 32, (g) => {
      g.fillStyle(PALETTE.grass);
      g.fillRect(0, 0, 32, 32);
      ditherPixels(g, 0, 0, 32, 32, PALETTE.grassDark, 0.2, 13);
      ditherPixels(g, 0, 0, 32, 32, PALETTE.grassLight, 0.12, 77);
      g.fillStyle(PALETTE.grassDark);
      g.fillRect(4, 6, 2, 4);
      g.fillRect(5, 5, 1, 1);
      g.fillRect(18, 14, 2, 4);
      g.fillRect(19, 13, 1, 1);
      g.fillRect(10, 22, 2, 4);
      g.fillRect(11, 21, 1, 1);
      g.fillRect(26, 6, 2, 3);
      g.fillStyle(0xFFE082);
      g.fillRect(14, 10, 2, 2);
      g.fillStyle(0xEF5350);
      g.fillRect(24, 24, 2, 2);
    });

    for (let frame = 0; frame < 4; frame++) {
      createTexture(scene, `tile_water_${frame}`, 32, 32, (g) => {
        g.fillStyle(PALETTE.water);
        g.fillRect(0, 0, 32, 32);
        g.fillStyle(PALETTE.waterDark);
        const yOff = frame * 3;
        g.fillRect(2, (6 + yOff) % 32, 10, 3);
        g.fillRect(18, (18 + yOff) % 32, 10, 3);
        g.fillRect(8, (28 + yOff) % 32, 8, 2);
        g.fillStyle(PALETTE.waterLight);
        g.fillRect(6, (2 + yOff) % 32, 8, 2);
        g.fillRect(20, (12 + yOff) % 32, 6, 2);
        g.fillRect(4, (22 + yOff) % 32, 5, 1);
        g.fillStyle(PALETTE.waterHighlight);
        g.fillRect(10, (4 + yOff) % 32, 3, 1);
        g.fillRect(22, (14 + yOff) % 32, 4, 1);
        g.fillRect(14, (26 + yOff) % 32, 3, 1);
        ditherPixels(g, 0, 0, 32, 32, PALETTE.waterDark, 0.08, 200 + frame * 50);
      });
    }
    createTexture(scene, 'tile_water', 32, 32, (g) => {
      g.fillStyle(PALETTE.water);
      g.fillRect(0, 0, 32, 32);
      g.fillStyle(PALETTE.waterDark);
      g.fillRect(2, 6, 10, 3);
      g.fillRect(18, 18, 10, 3);
      g.fillStyle(PALETTE.waterLight);
      g.fillRect(6, 2, 8, 2);
      g.fillRect(20, 12, 6, 2);
      g.fillStyle(PALETTE.waterHighlight);
      g.fillRect(10, 4, 3, 1);
      g.fillRect(22, 14, 4, 1);
      ditherPixels(g, 0, 0, 32, 32, PALETTE.waterDark, 0.08, 200);
    });

    createTexture(scene, 'tile_cobblestone', 32, 32, (g) => {
      g.fillStyle(0x6A5B4D);
      g.fillRect(0, 0, 32, 32);
      const stones = [
        { x: 2, y: 2, w: 12, h: 10 },
        { x: 18, y: 2, w: 11, h: 10 },
        { x: 2, y: 16, w: 10, h: 12 },
        { x: 16, y: 16, w: 13, h: 10 },
        { x: 14, y: 4, w: 3, h: 8 },
        { x: 13, y: 14, w: 4, h: 4 },
      ];
      for (const s of stones) {
        g.fillStyle(0x8B7B6B);
        g.fillRect(s.x, s.y, s.w, s.h);
        g.fillStyle(0x9A8A7A);
        g.fillRect(s.x, s.y, s.w, 1);
        g.fillRect(s.x, s.y, 1, s.h);
        g.fillStyle(0x5A4B3D);
        g.fillRect(s.x, s.y + s.h - 1, s.w, 1);
        g.fillRect(s.x + s.w - 1, s.y, 1, s.h);
      }
      ditherPixels(g, 0, 0, 32, 32, 0x7A6B5D, 0.12, 88);
    });

    createTexture(scene, 'tile_wall', 32, 32, (g) => {
      g.fillStyle(PALETTE.cream);
      g.fillRect(0, 0, 32, 32);
      g.fillStyle(0xEDE5D8);
      g.fillRect(0, 0, 2, 32);
      g.fillRect(30, 0, 2, 32);
      g.fillStyle(0xF5EDE0);
      g.fillRect(2, 28, 28, 4);
      g.fillStyle(0xE8E0D0);
      g.fillRect(2, 0, 28, 2);
      ditherPixels(g, 2, 2, 28, 26, 0xEDE5D8, 0.06, 33);
    });

    createTexture(scene, 'tile_brick_wall', 32, 32, (g) => {
      g.fillStyle(0xD0C4B0);
      g.fillRect(0, 0, 32, 32);
      for (let row = 0; row < 4; row++) {
        const offset = row % 2 === 0 ? 0 : 8;
        for (let col = -1; col < 4; col++) {
          const bx = offset + col * 16;
          const by = row * 8;
          if (bx + 14 < 0 || bx >= 32) continue;
          g.fillStyle(PALETTE.brick);
          g.fillRect(Math.max(0, bx + 1), by + 1, Math.min(13, 32 - bx - 1), 5);
          g.fillStyle(PALETTE.brickLight);
          g.fillRect(Math.max(0, bx + 1), by + 1, Math.min(13, 32 - bx - 1), 1);
          g.fillStyle(PALETTE.brickDark);
          g.fillRect(Math.max(0, bx + 1), by + 5, Math.min(13, 32 - bx - 1), 1);
        }
      }
      ditherPixels(g, 0, 0, 32, 32, PALETTE.brickDark, 0.05, 44);
    });

    createTexture(scene, 'tile_office_floor', 32, 32, (g) => {
      g.fillStyle(PALETTE.stoneLight);
      g.fillRect(0, 0, 32, 32);
      g.fillStyle(PALETTE.stone);
      for (let y = 0; y < 32; y += 8) {
        for (let x = (y / 8) % 2 === 0 ? 0 : 8; x < 32; x += 16) {
          g.fillRect(x, y, 8, 8);
        }
      }
      g.fillStyle(0xCDCDCD);
      g.fillRect(0, 0, 32, 1);
      g.fillRect(0, 16, 32, 1);
      g.fillRect(0, 0, 1, 32);
      g.fillRect(16, 0, 1, 32);
      g.fillStyle(0xD8D8D8);
      g.fillRect(6, 6, 3, 1);
      g.fillRect(22, 22, 3, 1);
    });

    createTexture(scene, 'tile_floor_wood', 32, 32, (g) => {
      g.fillStyle(0x7A5C14);
      g.fillRect(0, 0, 32, 32);
      for (let i = 0; i < 4; i++) {
        g.fillStyle(i % 2 === 0 ? 0x8B6914 : 0x9A7A1A);
        g.fillRect(i * 8, 0, 7, 32);
        g.fillStyle(0x6B5210);
        g.fillRect(i * 8, 0, 1, 32);
      }
    });
    createTexture(scene, 'tile_floor_office', 32, 32, (g) => {
      g.fillStyle(PALETTE.stoneLight);
      g.fillRect(0, 0, 32, 32);
      g.fillStyle(PALETTE.stone);
      for (let y = 0; y < 32; y += 8) {
        for (let x = (y / 8) % 2 === 0 ? 0 : 8; x < 32; x += 16) {
          g.fillRect(x, y, 8, 8);
        }
      }
    });

    createTexture(scene, 'tile_market_ground', 32, 32, (g) => {
      g.fillStyle(0xD4C4A8);
      g.fillRect(0, 0, 32, 32);
      g.fillStyle(0xC4B498);
      g.fillRect(1, 1, 14, 14);
      g.fillRect(17, 17, 14, 14);
      g.fillStyle(0xBEAE92);
      g.fillRect(0, 0, 32, 1);
      g.fillRect(0, 16, 32, 1);
      g.fillRect(0, 0, 1, 32);
      g.fillRect(16, 0, 1, 32);
      ditherPixels(g, 0, 0, 32, 32, 0xC0B090, 0.1, 66);
      g.fillStyle(0xE4D4B8);
      g.fillRect(4, 4, 2, 2);
      g.fillRect(20, 20, 2, 2);
    });

    // ========== CHARACTER SPRITES (16x32 with walk frames) ==========

    TextureGenerator.generateCharacterFrames(scene, 'player', 0x5C3A1E, PALETTE.cream, PALETTE.deepBlue);

    const npcs = [
      ['npc_katrien', 0xF5DEB3, 0xFFDBAC, 0x1B5E20],
      ['npc_marco', 0x3E2723, 0xD4A574, 0xE53935],
      ['npc_helena', 0xB0BEC5, 0xFFE0B2, 0x7B1FA2],
      ['npc_jake', 0x5D4037, 0xFFCBA4, 0x1565C0],
      ['npc_yuki', 0x212121, 0xFFE0BD, 0xF06292],
      ['npc_bernie', 0x3E2723, 0x8D6E63, 0x37474F],
      ['npc_lena', 0xFFCC80, 0xFFE0B2, 0x00897B],
      ['npc_pieter', 0x795548, 0xFFCBA4, 0xFF8F00],
      ['npc_sophie', 0x4E342E, 0xFFDBAC, 0xC62828],
      ['npc_oliver', 0x6D4C41, 0xFFE0B2, 0x455A64],
      ['npc_anouk', 0x8B4513, 0xE8D4C4, 0x4682B4],
      ['npc_tomas', 0x2C1810, 0xD4A574, 0x8B0000],
    ];
    for (const [id, hair, skin, shirt] of npcs) {
      TextureGenerator.generateCharacterFrames(scene, id, hair, skin, shirt);
    }

    // ========== OBJECT / FURNITURE TEXTURES ==========

    createTexture(scene, 'obj_desk', 32, 32, (g) => {
      g.fillStyle(PALETTE.warmBrown);
      g.fillRect(2, 10, 28, 18);
      g.fillStyle(0x7A5910);
      g.fillRect(2, 10, 28, 2);
      g.fillStyle(PALETTE.darkWood);
      g.fillRect(4, 28, 4, 4);
      g.fillRect(24, 28, 4, 4);
      g.fillStyle(0x3A3A5A);
      g.fillRect(14, 12, 12, 8);
      g.fillStyle(0x5A8ABB);
      g.fillRect(15, 13, 10, 6);
      g.fillStyle(PALETTE.cream);
      g.fillRect(4, 13, 8, 6);
      g.fillStyle(0xDDD5C5);
      g.fillRect(5, 14, 6, 4);
      g.fillStyle(0xE53935);
      g.fillRect(6, 15, 2, 1);
    });

    createTexture(scene, 'obj_bed', 32, 48, (g) => {
      g.fillStyle(PALETTE.warmBrown);
      g.fillRect(0, 2, 32, 6);
      g.fillRect(0, 40, 32, 8);
      g.fillStyle(0x6B4A1E);
      g.fillRect(0, 2, 32, 2);
      g.fillStyle(PALETTE.cream);
      g.fillRect(2, 6, 28, 6);
      g.fillStyle(0xEEE6D6);
      g.fillRect(4, 7, 12, 4);
      g.fillRect(18, 7, 10, 4);
      g.fillStyle(0x3A6BA8);
      g.fillRect(2, 12, 28, 28);
      g.fillStyle(0x4A7BB8);
      g.fillRect(4, 14, 24, 24);
      g.fillStyle(0x3A6BA8);
      g.fillRect(4, 26, 24, 2);
    });

    createTexture(scene, 'obj_coffee', 32, 32, (g) => {
      g.fillStyle(PALETTE.stone);
      g.fillRect(4, 8, 24, 24);
      g.fillStyle(0xA8A8A8);
      g.fillRect(4, 8, 24, 2);
      g.fillStyle(PALETTE.stoneLight);
      g.fillRect(8, 12, 16, 10);
      g.fillStyle(PALETTE.darkWood);
      g.fillRect(10, 22, 12, 10);
      g.fillStyle(0x8B4513);
      g.fillRect(12, 2, 8, 8);
      g.fillStyle(PALETTE.warmOrange);
      g.fillRect(14, 4, 4, 4);
      g.fillStyle(0xCCCCCC);
      g.fillRect(12, 0, 2, 3);
      g.fillRect(16, -1, 2, 3);
    });

    createTexture(scene, 'obj_coffee_machine', 16, 24, (g) => {
      g.fillStyle(PALETTE.stone);
      g.fillRect(0, 4, 16, 20);
      g.fillStyle(0xA8A8A8);
      g.fillRect(0, 4, 16, 2);
      g.fillStyle(PALETTE.stoneLight);
      g.fillRect(2, 7, 12, 7);
      g.fillStyle(PALETTE.darkWood);
      g.fillRect(4, 16, 8, 8);
      g.fillStyle(PALETTE.warmOrange);
      g.fillRect(2, 0, 6, 4);
      g.fillStyle(0xE53935);
      g.fillRect(10, 8, 2, 2);
    });

    createTexture(scene, 'obj_chair', 16, 16, (g) => {
      g.fillStyle(PALETTE.warmBrown);
      g.fillRect(4, 8, 8, 8);
      g.fillStyle(0x7A5910);
      g.fillRect(4, 8, 8, 1);
      g.fillStyle(PALETTE.darkWood);
      g.fillRect(2, 2, 12, 4);
      g.fillRect(2, 2, 3, 10);
      g.fillRect(11, 2, 3, 10);
      g.fillStyle(0x4A3018);
      g.fillRect(2, 2, 12, 1);
    });

    createTexture(scene, 'obj_table', 32, 32, (g) => {
      g.fillStyle(PALETTE.darkWood);
      g.fillCircle(16, 16, 13);
      g.fillStyle(PALETTE.warmBrown);
      g.fillCircle(16, 16, 11);
      g.fillStyle(0x9A7A1A);
      g.fillCircle(16, 14, 8);
      g.fillStyle(PALETTE.warmBrown);
      g.fillCircle(16, 15, 7);
      g.fillStyle(0x8B8B8B);
      g.fillRect(12, 10, 3, 2);
      g.fillStyle(PALETTE.cream);
      g.fillRect(17, 12, 4, 3);
    });

    createTexture(scene, 'obj_bookshelf', 32, 32, (g) => {
      g.fillStyle(PALETTE.darkWood);
      g.fillRect(0, 0, 32, 32);
      g.fillStyle(0x4A3018);
      g.fillRect(0, 15, 32, 2);
      g.fillRect(0, 0, 2, 32);
      g.fillRect(30, 0, 2, 32);
      const books = [
        { x: 3, h: 13, c: 0xC62828 },
        { x: 7, h: 12, c: 0x1565C0 },
        { x: 11, h: 14, c: 0x2E7D32 },
        { x: 15, h: 11, c: 0xF9A825 },
        { x: 19, h: 13, c: 0x7B1FA2 },
        { x: 23, h: 10, c: 0xE65100 },
        { x: 27, h: 12, c: 0x00695C },
      ];
      for (const b of books) {
        g.fillStyle(b.c);
        g.fillRect(b.x, 15 - b.h, 3, b.h);
        g.fillStyle(0xFFFFFF);
        g.fillRect(b.x + 1, 15 - b.h + 2, 1, 3);
      }
      const books2 = [
        { x: 3, h: 12, c: 0x0D47A1 },
        { x: 7, h: 14, c: 0xBF360C },
        { x: 11, h: 11, c: 0x1B5E20 },
        { x: 15, h: 13, c: 0x4A148C },
        { x: 19, h: 10, c: 0xFF8F00 },
        { x: 24, h: 12, c: 0x880E4F },
      ];
      for (const b of books2) {
        g.fillStyle(b.c);
        g.fillRect(b.x, 32 - b.h, 4, b.h);
        g.fillStyle(0xDDDDDD);
        g.fillRect(b.x + 1, 32 - b.h + 2, 2, 2);
      }
      g.fillStyle(0x6B4A1E);
      g.fillRect(22, 20, 5, 8);
    });

    createTexture(scene, 'obj_door', 32, 32, (g) => {
      g.fillStyle(PALETTE.doorColor);
      g.fillRect(4, 0, 24, 32);
      g.fillStyle(PALETTE.darkWood);
      g.fillRect(4, 0, 24, 2);
      g.fillRect(4, 0, 2, 32);
      g.fillRect(26, 0, 2, 32);
      g.fillStyle(0x8A6A4A);
      g.fillRect(8, 4, 16, 12);
      g.fillRect(8, 20, 16, 10);
      g.fillStyle(PALETTE.windowGlow);
      g.fillRect(22, 14, 3, 5);
    });

    createTexture(scene, 'obj_phone', 12, 16, (g) => {
      g.fillStyle(0x2A2A2A);
      g.fillRect(1, 1, 10, 14);
      g.fillStyle(0x3A3A3A);
      g.fillRect(2, 2, 8, 10);
      g.fillStyle(0x5A8ABB);
      g.fillRect(2, 2, 8, 8);
      g.fillStyle(PALETTE.deepBlue);
      g.fillRect(4, 12, 4, 2);
    });

    createTexture(scene, 'obj_market_stall', 48, 32, (g) => {
      g.fillStyle(PALETTE.warmBrown);
      g.fillRect(2, 16, 44, 16);
      g.fillStyle(0x7A5910);
      g.fillRect(2, 16, 44, 2);
      const stripeColors = [0xC62828, PALETTE.cream];
      for (let i = 0; i < 11; i++) {
        g.fillStyle(stripeColors[i % 2]);
        g.fillRect(2 + i * 4, 4, 4, 12);
      }
      g.fillStyle(PALETTE.roofTile);
      g.fillRect(0, 4, 2, 14);
      g.fillRect(46, 4, 2, 14);
      g.fillStyle(PALETTE.cream);
      g.fillRect(6, 20, 10, 8);
      g.fillStyle(0xFFE082);
      g.fillRect(8, 22, 3, 3);
      g.fillStyle(0xFF8A65);
      g.fillRect(12, 22, 3, 3);
      g.fillStyle(0xFFA726);
      g.fillRect(20, 21, 8, 6);
      g.fillRect(32, 21, 8, 6);
      g.fillStyle(0xE65100);
      g.fillRect(22, 22, 4, 4);
      g.fillStyle(0xF9A825);
      g.fillRect(34, 23, 4, 3);
    });

    createTexture(scene, 'obj_bicycle', 24, 32, (g) => {
      g.fillStyle(0x37474F);
      g.fillCircle(6, 22, 5);
      g.fillCircle(18, 22, 5);
      g.fillStyle(0x263238);
      g.fillCircle(6, 22, 3);
      g.fillCircle(18, 22, 3);
      g.fillStyle(0xE53935);
      g.fillRect(6, 12, 12, 3);
      g.fillRect(6, 12, 2, 10);
      g.fillRect(16, 12, 2, 10);
      g.fillRect(10, 6, 2, 8);
      g.fillStyle(0x37474F);
      g.fillRect(8, 4, 6, 3);
    });

    createTexture(scene, 'obj_tree', 32, 48, (g) => {
      g.fillStyle(0x5D4037);
      g.fillRect(13, 28, 6, 20);
      g.fillStyle(0x4E342E);
      g.fillRect(13, 28, 2, 20);
      g.fillStyle(0x6D4C41);
      g.fillRect(17, 28, 2, 20);
      g.fillStyle(0x388E3C);
      g.fillCircle(16, 14, 14);
      g.fillStyle(0x43A047);
      g.fillCircle(10, 10, 8);
      g.fillCircle(22, 12, 7);
      g.fillStyle(0x2E7D32);
      g.fillCircle(16, 18, 10);
      g.fillStyle(0x558B2F);
      g.fillCircle(8, 20, 6);
      g.fillCircle(24, 18, 6);
      g.fillStyle(PALETTE.grassLight);
      g.fillRect(10, 6, 3, 2);
      g.fillRect(18, 10, 2, 2);
      g.fillRect(8, 16, 2, 1);
    });

    createTexture(scene, 'obj_lamp', 8, 32, (g) => {
      g.fillStyle(0x37474F);
      g.fillRect(3, 8, 2, 24);
      g.fillRect(2, 30, 4, 2);
      g.fillStyle(0x455A64);
      g.fillRect(1, 2, 6, 8);
      g.fillStyle(PALETTE.windowGlow);
      g.fillRect(2, 3, 4, 6);
      g.fillStyle(0xFFF8E1);
      g.fillRect(3, 4, 2, 4);
    });

    createTexture(scene, 'obj_canal_rail', 32, 8, (g) => {
      g.fillStyle(PALETTE.stoneDark);
      g.fillRect(0, 2, 32, 4);
      g.fillStyle(PALETTE.stoneLight);
      g.fillRect(0, 0, 32, 2);
      g.fillStyle(PALETTE.stone);
      g.fillRect(0, 0, 4, 8);
      g.fillRect(14, 0, 4, 8);
      g.fillRect(28, 0, 4, 8);
    });

    createTexture(scene, 'obj_smoking_area', 16, 16, (g) => {
      g.fillStyle(0x455A64);
      g.fillRect(2, 6, 12, 8);
      g.fillStyle(0x37474F);
      g.fillRect(4, 8, 8, 4);
      g.fillStyle(0xBDBDBD);
      g.fillRect(6, 4, 2, 4);
      g.fillStyle(0x999999);
      g.fillRect(6, 2, 2, 2);
    });

    createTexture(scene, 'obj_bench', 24, 16, (g) => {
      g.fillStyle(PALETTE.warmBrown);
      g.fillRect(2, 6, 20, 4);
      g.fillRect(2, 12, 20, 3);
      g.fillStyle(PALETTE.darkWood);
      g.fillRect(2, 4, 20, 2);
      g.fillStyle(0x37474F);
      g.fillRect(4, 10, 2, 6);
      g.fillRect(18, 10, 2, 6);
    });

    // ========== RAIN PARTICLE ==========

    createTexture(scene, 'particle_rain', 2, 8, (g) => {
      g.fillStyle(0xAAC8E8);
      g.fillRect(0, 0, 1, 8);
      g.fillStyle(0xCCE0F0);
      g.fillRect(1, 1, 1, 6);
    });

    // ========== TRAVEL MAP TEXTURES ==========

    createTexture(scene, 'map_node', 20, 20, (g) => {
      g.fillStyle(PALETTE.warmOrange);
      g.fillCircle(10, 10, 9);
      g.fillStyle(0xFFCC80);
      g.fillCircle(10, 10, 6);
      g.fillStyle(PALETTE.cream);
      g.fillCircle(10, 8, 3);
    });

    createTexture(scene, 'map_node_locked', 20, 20, (g) => {
      g.fillStyle(0x555555);
      g.fillCircle(10, 10, 9);
      g.fillStyle(0x777777);
      g.fillCircle(10, 10, 6);
      g.fillStyle(0x999999);
      g.fillCircle(10, 8, 3);
    });

    createTexture(scene, 'map_node_current', 20, 20, (g) => {
      g.fillStyle(0x66BB6A);
      g.fillCircle(10, 10, 9);
      g.fillStyle(0x81C784);
      g.fillCircle(10, 10, 6);
      g.fillStyle(PALETTE.cream);
      g.fillCircle(10, 8, 3);
    });

    // ========== UI TEXTURES ==========

    createTexture(scene, 'ui_heart_full', 12, 12, (g) => {
      g.fillStyle(PALETTE.heartFull);
      g.fillCircle(3, 4, 2.5);
      g.fillCircle(9, 4, 2.5);
      g.fillTriangle(1, 5, 11, 5, 6, 11);
    });

    createTexture(scene, 'ui_heart_empty', 12, 12, (g) => {
      g.lineStyle(2, PALETTE.heartEmpty);
      g.strokeCircle(3, 4, 2.5);
      g.strokeCircle(9, 4, 2.5);
      g.beginPath();
      g.moveTo(2, 6);
      g.lineTo(6, 11);
      g.lineTo(10, 6);
      g.closePath();
      g.strokePath();
    });

    createTexture(scene, 'ui_energy_pip', 8, 16, (g) => {
      g.fillStyle(PALETTE.energyFull);
      g.fillRoundedRect(0, 2, 8, 12, 2);
    });

    createTexture(scene, 'ui_energy_pip_empty', 8, 16, (g) => {
      g.fillStyle(PALETTE.energyEmpty);
      g.fillRoundedRect(0, 2, 8, 12, 2);
    });

    createTexture(scene, 'ui_button', 120, 36, (g) => {
      g.fillStyle(PALETTE.uiPanel);
      g.fillRoundedRect(0, 0, 120, 36, 6);
      g.lineStyle(2, PALETTE.uiBorder);
      g.strokeRoundedRect(1, 1, 118, 34, 5);
    });

    createTexture(scene, 'ui_panel', 200, 150, (g) => {
      g.fillStyle(PALETTE.uiPanel);
      g.fillRoundedRect(0, 0, 200, 150, 8);
      g.lineStyle(2, PALETTE.uiBorder);
      g.strokeRoundedRect(1, 1, 198, 148, 7);
    });

    createTexture(scene, 'ui_arrow', 16, 16, (g) => {
      g.fillStyle(PALETTE.uiText);
      g.fillTriangle(4, 2, 4, 14, 14, 8);
    });

    createTexture(scene, 'icon_script', 24, 24, (g) => {
      g.fillStyle(PALETTE.cream);
      g.fillRect(4, 2, 16, 20);
      g.fillStyle(0xCCC4B4);
      g.fillRect(6, 5, 10, 1);
      g.fillRect(6, 8, 12, 1);
      g.fillRect(6, 11, 8, 1);
      g.fillRect(6, 14, 11, 1);
      g.fillRect(6, 17, 6, 1);
    });

    createTexture(scene, 'icon_mail', 24, 24, (g) => {
      g.fillStyle(PALETTE.cream);
      g.fillRect(4, 6, 16, 12);
      g.fillStyle(PALETTE.uiPanelLight);
      g.fillTriangle(4, 6, 20, 6, 12, 14);
      g.fillStyle(0xEDE5D5);
      g.fillRect(6, 14, 12, 4);
    });
  }
}

export { PALETTE };
