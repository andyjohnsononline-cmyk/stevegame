const PALETTE = {
  warmOrange: 0xE8913A,
  deepBlue: 0x2B4570,
  warmBrown: 0x8B6914,
  cream: 0xFFF5E1,
  darkWood: 0x5C3A1E,
  water: 0x4A90D9,
  waterDark: 0x3A7BC8,
  grass: 0x7CB342,
  grassDark: 0x558B2F,
  stone: 0x9E9E9E,
  stoneLight: 0xBDBDBD,
  brick: 0xC75B39,
  brickDark: 0xA0452C,
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
};

const CARPET_COLOR = 0x722F37;
const CARPET_BORDER = 0x5C252C;

function createTexture(scene, key, width, height, drawFn) {
  const g = scene.make.graphics({ add: false });
  drawFn(g);
  g.generateTexture(key, width, height);
  g.destroy();
}

export class TextureGenerator {
  static generateCharacterSprite(scene, key, hairColor, skinColor, shirtColor) {
    const g = scene.make.graphics({ add: false });
    // 16x32 sprite: head (circle-ish 12x10), body (12x14), legs (two small rects)
    // Head - oval-ish (rects for pixel art look)
    g.fillStyle(skinColor);
    g.fillRect(2, 0, 12, 10);
    g.fillStyle(hairColor);
    g.fillRect(2, 0, 12, 4);
    g.fillRect(2, 4, 4, 4);
    g.fillRect(10, 4, 4, 4);
    // Body
    g.fillStyle(shirtColor);
    g.fillRect(2, 10, 12, 14);
    // Legs
    g.fillStyle(0x4A3728);
    g.fillRect(3, 24, 4, 8);
    g.fillRect(9, 24, 4, 8);
    g.generateTexture(key, 16, 32);
    g.destroy();
  }

  static generateAll(scene) {
    // --- TILE TEXTURES (32x32) ---
    createTexture(scene, 'tile_wood_floor', 32, 32, (g) => {
      g.fillStyle(PALETTE.warmBrown);
      g.fillRect(0, 0, 32, 32);
      g.fillStyle(PALETTE.darkWood);
      for (let i = 0; i < 4; i++) {
        g.fillRect(i * 8, 0, 6, 32);
      }
      g.fillStyle(0x9A7A1A);
      g.fillRect(2, 2, 6, 28);
      g.fillRect(10, 2, 6, 28);
      g.fillRect(18, 2, 6, 28);
      g.fillRect(26, 2, 4, 28);
    });

    createTexture(scene, 'tile_carpet', 32, 32, (g) => {
      g.fillStyle(CARPET_COLOR);
      g.fillRect(0, 0, 32, 32);
      g.fillStyle(CARPET_BORDER);
      g.fillRect(0, 0, 32, 2);
      g.fillRect(0, 30, 32, 2);
      g.fillRect(0, 0, 2, 32);
      g.fillRect(30, 0, 2, 32);
    });

    createTexture(scene, 'tile_stone_floor', 32, 32, (g) => {
      g.fillStyle(PALETTE.stone);
      g.fillRect(0, 0, 32, 32);
      g.fillStyle(PALETTE.stoneLight);
      g.fillRect(0, 0, 16, 16);
      g.fillRect(16, 16, 16, 16);
      g.fillStyle(0x8E8E8E);
      g.fillRect(0, 0, 32, 1);
      g.fillRect(0, 0, 1, 32);
      for (let i = 8; i < 32; i += 8) {
        g.fillRect(i, 0, 1, 32);
        g.fillRect(0, i, 32, 1);
      }
    });

    createTexture(scene, 'tile_grass', 32, 32, (g) => {
      g.fillStyle(PALETTE.grass);
      g.fillRect(0, 0, 32, 32);
      g.fillStyle(PALETTE.grassDark);
      g.fillRect(4, 6, 6, 6);
      g.fillRect(18, 12, 6, 6);
      g.fillRect(8, 20, 6, 6);
      g.fillRect(22, 4, 6, 6);
    });

    createTexture(scene, 'tile_water', 32, 32, (g) => {
      g.fillStyle(PALETTE.water);
      g.fillRect(0, 0, 32, 32);
      g.fillStyle(PALETTE.waterDark);
      g.fillRect(4, 8, 8, 4);
      g.fillRect(20, 16, 8, 4);
      g.fillStyle(0x5A9FE8);
      g.fillRect(8, 4, 6, 3);
      g.fillRect(18, 20, 6, 3);
    });

    createTexture(scene, 'tile_cobblestone', 32, 32, (g) => {
      g.fillStyle(0x7A6B5D);
      g.fillRect(0, 0, 32, 32);
      g.fillStyle(0x8B7B6B);
      g.fillRect(4, 4, 10, 10);
      g.fillRect(18, 4, 10, 10);
      g.fillRect(4, 18, 10, 10);
      g.fillRect(18, 18, 10, 10);
      g.fillStyle(0x6A5B4D);
      g.fillRect(14, 14, 4, 4);
    });

    createTexture(scene, 'tile_wall', 32, 32, (g) => {
      g.fillStyle(PALETTE.cream);
      g.fillRect(0, 0, 32, 32);
      g.fillStyle(0xF5EDE0);
      g.fillRect(0, 0, 2, 32);
      g.fillRect(30, 0, 2, 32);
    });

    createTexture(scene, 'tile_brick_wall', 32, 32, (g) => {
      g.fillStyle(0xE8E0D8);
      g.fillRect(0, 0, 32, 32);
      g.fillStyle(PALETTE.brick);
      for (let row = 0; row < 4; row++) {
        const offset = row % 2 === 0 ? 0 : 8;
        for (let col = 0; col < 4; col++) {
          g.fillRect(offset + col * 16, row * 8, 14, 6);
        }
      }
      g.fillStyle(PALETTE.brickDark);
      g.fillRect(8, 4, 14, 6);
      g.fillRect(24, 12, 6, 6);
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
    });

    // Aliases for GameScene/locationData compatibility
    createTexture(scene, 'tile_floor_wood', 32, 32, (g) => {
      g.fillStyle(PALETTE.warmBrown);
      g.fillRect(0, 0, 32, 32);
      g.fillStyle(PALETTE.darkWood);
      for (let i = 0; i < 4; i++) g.fillRect(i * 8, 0, 6, 32);
      g.fillStyle(0x9A7A1A);
      g.fillRect(2, 2, 6, 28);
      g.fillRect(10, 2, 6, 28);
      g.fillRect(18, 2, 6, 28);
      g.fillRect(26, 2, 4, 28);
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
      g.fillRect(0, 0, 16, 16);
      g.fillRect(16, 16, 16, 16);
      g.fillStyle(0xE4D4B8);
      g.fillRect(4, 4, 8, 8);
      g.fillRect(20, 20, 8, 8);
    });

    // --- PLAYER (Steve) - 16x32 ---
    TextureGenerator.generateCharacterSprite(scene, 'player', 0x5C3A1E, PALETTE.cream, PALETTE.deepBlue);

    // --- NPCs ---
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
    ];
    for (const [id, hair, skin, shirt] of npcs) {
      TextureGenerator.generateCharacterSprite(scene, id, hair, skin, shirt);
    }

    // --- OBJECT/FURNITURE TEXTURES ---
    createTexture(scene, 'obj_desk', 32, 32, (g) => {
      g.fillStyle(PALETTE.warmBrown);
      g.fillRect(2, 10, 28, 20);
      g.fillStyle(PALETTE.darkWood);
      g.fillRect(4, 28, 10, 4);
      g.fillRect(18, 28, 10, 4);
      g.fillRect(4, 6, 24, 6);
    });

    createTexture(scene, 'obj_bed', 32, 48, (g) => {
      g.fillStyle(PALETTE.cream);
      g.fillRect(0, 8, 32, 32);
      g.fillStyle(PALETTE.deepBlue);
      g.fillRect(0, 4, 32, 8);
      g.fillStyle(PALETTE.warmBrown);
      g.fillRect(0, 40, 32, 8);
      g.fillStyle(0x3A6BA8);
      g.fillRect(4, 12, 24, 20);
    });

    createTexture(scene, 'obj_coffee', 32, 32, (g) => {
      g.fillStyle(PALETTE.stone);
      g.fillRect(4, 8, 24, 24);
      g.fillStyle(PALETTE.stoneLight);
      g.fillRect(8, 12, 16, 12);
      g.fillStyle(PALETTE.darkWood);
      g.fillRect(10, 22, 12, 10);
      g.fillStyle(PALETTE.warmOrange);
      g.fillRect(6, 2, 10, 6);
    });

    createTexture(scene, 'obj_coffee_machine', 16, 24, (g) => {
      g.fillStyle(PALETTE.stone);
      g.fillRect(0, 4, 16, 20);
      g.fillStyle(PALETTE.stoneLight);
      g.fillRect(2, 6, 12, 8);
      g.fillStyle(PALETTE.darkWood);
      g.fillRect(4, 16, 8, 8);
      g.fillStyle(PALETTE.warmOrange);
      g.fillRect(2, 0, 6, 4);
    });

    createTexture(scene, 'obj_chair', 16, 16, (g) => {
      g.fillStyle(PALETTE.warmBrown);
      g.fillRect(4, 8, 8, 8);
      g.fillRect(2, 2, 12, 4);
      g.fillRect(2, 2, 3, 10);
      g.fillRect(11, 2, 3, 10);
    });

    createTexture(scene, 'obj_table', 32, 32, (g) => {
      g.fillStyle(PALETTE.darkWood);
      g.fillCircle(16, 16, 12);
      g.fillStyle(PALETTE.warmBrown);
      g.fillCircle(16, 16, 10);
    });

    createTexture(scene, 'obj_bookshelf', 32, 32, (g) => {
      g.fillStyle(PALETTE.darkWood);
      g.fillRect(0, 0, 32, 32);
      g.fillStyle(0xC62828);
      g.fillRect(2, 2, 6, 28);
      g.fillStyle(0x1565C0);
      g.fillRect(10, 2, 6, 28);
      g.fillStyle(0x2E7D32);
      g.fillRect(18, 2, 6, 28);
      g.fillStyle(0xF9A825);
      g.fillRect(26, 2, 4, 28);
    });

    createTexture(scene, 'obj_door', 32, 32, (g) => {
      g.fillStyle(PALETTE.doorColor);
      g.fillRect(0, 0, 32, 32);
      g.fillStyle(PALETTE.darkWood);
      g.fillRect(4, 4, 24, 24);
      g.fillStyle(PALETTE.windowGlow);
      g.fillRect(22, 12, 4, 8);
    });

    createTexture(scene, 'obj_phone', 12, 16, (g) => {
      g.fillStyle(PALETTE.stone);
      g.fillRect(0, 2, 12, 14);
      g.fillStyle(PALETTE.stoneLight);
      g.fillRect(2, 4, 8, 8);
      g.fillStyle(PALETTE.deepBlue);
      g.fillRect(4, 12, 4, 2);
    });

    createTexture(scene, 'obj_market_stall', 48, 32, (g) => {
      g.fillStyle(PALETTE.warmBrown);
      g.fillRect(0, 16, 48, 16);
      g.fillStyle(PALETTE.roofTile);
      g.fillRect(2, 4, 44, 14);
      g.fillStyle(PALETTE.warmOrange);
      g.fillRect(4, 8, 40, 6);
      g.fillStyle(PALETTE.cream);
      g.fillRect(8, 20, 32, 8);
    });

    createTexture(scene, 'obj_bicycle', 24, 32, (g) => {
      g.fillStyle(0x37474F);
      g.fillRect(8, 4, 8, 24);
      g.fillCircle(4, 8, 6);
      g.fillCircle(20, 8, 6);
      g.fillRect(4, 6, 16, 4);
      g.fillStyle(0x455A64);
      g.fillRect(10, 12, 4, 12);
    });

    createTexture(scene, 'obj_tree', 32, 48, (g) => {
      g.fillStyle(PALETTE.grassDark);
      g.fillRect(12, 28, 8, 20);
      g.fillStyle(PALETTE.grass);
      g.fillCircle(16, 12, 14);
      g.fillStyle(0x558B2F);
      g.fillCircle(8, 18, 8);
      g.fillCircle(24, 18, 8);
    });

    createTexture(scene, 'obj_lamp', 8, 32, (g) => {
      g.fillStyle(0x37474F);
      g.fillRect(2, 0, 4, 24);
      g.fillStyle(PALETTE.windowGlow);
      g.fillRect(0, 20, 8, 12);
      g.fillStyle(0x455A64);
      g.fillRect(1, 21, 6, 10);
    });

    createTexture(scene, 'obj_canal_rail', 32, 8, (g) => {
      g.fillStyle(PALETTE.stone);
      g.fillRect(0, 2, 32, 4);
      g.fillStyle(PALETTE.stoneLight);
      g.fillRect(0, 0, 32, 2);
      g.fillRect(0, 0, 4, 8);
      g.fillRect(28, 0, 4, 8);
      g.fillRect(14, 0, 4, 8);
    });

    // --- UI TEXTURES ---
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
      g.fillStyle(PALETTE.uiText);
      g.fillRect(6, 4, 8, 2);
      g.fillRect(6, 8, 10, 2);
      g.fillRect(6, 12, 6, 2);
    });

    createTexture(scene, 'icon_mail', 24, 24, (g) => {
      g.fillStyle(PALETTE.cream);
      g.fillRect(4, 4, 16, 16);
      g.fillStyle(PALETTE.uiPanelLight);
      g.fillTriangle(4, 4, 20, 4, 12, 12);
      g.fillRect(6, 14, 12, 6);
    });
  }
}

export { PALETTE };
