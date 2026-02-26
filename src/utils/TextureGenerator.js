const PALETTE = {
  grass: 0x4a8c5c,
  grassLight: 0x5ca86e,
  grassDark: 0x3d7a4e,
  grassAlt: 0x52965e,
  path: 0xc4a96a,
  pathDark: 0xb09858,
  floor: 0x8899aa,
  floorDark: 0x778899,
  water: 0x3388bb,
  waterDark: 0x2266aa,
  waterLight: 0x55aadd,
  skin: 0xf5c6a0,
  shirt: 0x3366cc,
  pants: 0x334455,
  hair: 0x553322,
  paper: 0xfff5e1,
  paperLine: 0xccc4b4,
  wood: 0x8b6914,
  woodDark: 0x5c3a1e,
  metal: 0x999999,
  metalDark: 0x666666,
  coffeeBrown: 0x6d4c2f,
  coffeeLight: 0x8d6e63,
  ideaYellow: 0xffd54f,
  ideaGlow: 0xffecb3,
  contactBlue: 0x64b5f6,
  contactDark: 0x2196f3,
  coin: 0xffd700,
  coinDark: 0xdaa520,
  pitchOrange: 0xff8a65,
  projectPurple: 0xab47bc,
  deskTop: 0x9e7c4f,
  deskLeg: 0x6b5230,
  uiPanel: 0x2d2d44,
  uiBorder: 0xe8913a,
  uiText: 0xfff5e1,
  xpOrange: 0xe8913a,
  xpGlow: 0xffcc66,
  white: 0xffffff,
  black: 0x000000,
  red: 0xff4444,
  green: 0x44cc44,
  spark: 0xffffaa,
  locked: 0x223344,
  lockedEdge: 0x445566,
  buyGlow: 0x66ff66,
};

function tex(scene, key, w, h, fn) {
  const g = scene.make.graphics({ add: false });
  fn(g);
  g.generateTexture(key, w, h);
  g.destroy();
}

export class TextureGenerator {
  static generateAll(scene) {
    this._generatePlayer(scene);
    this._generateGround(scene);
    this._generateNodes(scene);
    this._generateDrops(scene);
    this._generateDesk(scene);
    this._generateUI(scene);
    this._generateDecorations(scene);
    this._generateEffects(scene);
    this._generateLand(scene);
  }

  static _generatePlayer(scene) {
    const dirs = ['down', 'up', 'left', 'right'];
    for (const dir of dirs) {
      tex(scene, `player_${dir}`, 16, 16, (g) => {
        g.fillStyle(PALETTE.hair);
        g.fillRect(4, 0, 8, 4);

        g.fillStyle(PALETTE.skin);
        g.fillRect(4, 3, 8, 5);

        if (dir === 'down') {
          g.fillStyle(PALETTE.black);
          g.fillRect(5, 4, 2, 2);
          g.fillRect(9, 4, 2, 2);
        } else if (dir === 'left') {
          g.fillStyle(PALETTE.black);
          g.fillRect(4, 4, 2, 2);
        } else if (dir === 'right') {
          g.fillStyle(PALETTE.black);
          g.fillRect(10, 4, 2, 2);
        }

        g.fillStyle(PALETTE.shirt);
        g.fillRect(3, 8, 10, 4);

        g.fillStyle(PALETTE.pants);
        g.fillRect(4, 12, 3, 4);
        g.fillRect(9, 12, 3, 4);
      });
    }
  }

  static _generateGround(scene) {
    tex(scene, 'tile_grass', 32, 32, (g) => {
      g.fillStyle(PALETTE.grass);
      g.fillRect(0, 0, 32, 32);
      g.fillStyle(PALETTE.grassLight);
      g.fillRect(4, 6, 2, 2);
      g.fillRect(18, 14, 2, 2);
      g.fillRect(10, 26, 2, 2);
      g.fillRect(26, 4, 2, 2);
      g.fillStyle(PALETTE.grassDark);
      g.fillRect(12, 2, 2, 2);
      g.fillRect(24, 20, 2, 2);
      g.fillRect(6, 22, 2, 2);
    });

    tex(scene, 'tile_grass_alt', 32, 32, (g) => {
      g.fillStyle(PALETTE.grassAlt);
      g.fillRect(0, 0, 32, 32);
      g.fillStyle(PALETTE.grassLight);
      g.fillRect(8, 4, 2, 2);
      g.fillRect(22, 22, 2, 2);
      g.fillRect(14, 16, 2, 2);
      g.fillStyle(PALETTE.grassDark);
      g.fillRect(2, 14, 2, 2);
      g.fillRect(20, 8, 2, 2);
    });

    tex(scene, 'tile_path', 32, 32, (g) => {
      g.fillStyle(PALETTE.path);
      g.fillRect(0, 0, 32, 32);
      g.fillStyle(PALETTE.pathDark);
      g.fillRect(6, 8, 3, 2);
      g.fillRect(20, 18, 3, 2);
      g.fillRect(14, 4, 2, 2);
      g.fillRect(8, 24, 3, 2);
    });

    tex(scene, 'tile_water', 32, 32, (g) => {
      g.fillStyle(PALETTE.water);
      g.fillRect(0, 0, 32, 32);
      g.fillStyle(PALETTE.waterDark);
      g.fillRect(4, 8, 8, 2);
      g.fillRect(16, 20, 10, 2);
      g.fillStyle(PALETTE.waterLight);
      g.fillRect(10, 4, 6, 1);
      g.fillRect(20, 14, 4, 1);
    });
  }

  static _generateNodes(scene) {
    tex(scene, 'node_script_pile', 32, 32, (g) => {
      g.fillStyle(PALETTE.woodDark);
      g.fillRect(4, 20, 24, 12);
      g.fillStyle(PALETTE.wood);
      g.fillRect(5, 21, 22, 10);
      g.fillStyle(PALETTE.paper);
      g.fillRect(6, 4, 18, 16);
      g.fillRect(8, 2, 16, 18);
      g.fillStyle(PALETTE.paperLine);
      g.fillRect(10, 6, 10, 1);
      g.fillRect(10, 9, 12, 1);
      g.fillRect(10, 12, 8, 1);
      g.fillRect(10, 15, 11, 1);
    });

    tex(scene, 'node_script_pile_depleted', 32, 32, (g) => {
      g.fillStyle(PALETTE.woodDark);
      g.fillRect(4, 22, 24, 10);
      g.fillStyle(PALETTE.wood);
      g.fillRect(5, 23, 22, 8);
    });

    tex(scene, 'node_idea_board', 32, 32, (g) => {
      g.fillStyle(PALETTE.woodDark);
      g.fillRect(14, 20, 4, 12);
      g.fillStyle(PALETTE.wood);
      g.fillRect(2, 2, 28, 20);
      g.fillStyle(0x557755);
      g.fillRect(4, 4, 24, 16);
      g.fillStyle(PALETTE.ideaYellow);
      g.fillRect(8, 7, 6, 6);
      g.fillRect(18, 9, 5, 5);
      g.fillStyle(PALETTE.red);
      g.fillRect(12, 12, 4, 4);
    });

    tex(scene, 'node_idea_board_depleted', 32, 32, (g) => {
      g.fillStyle(PALETTE.woodDark);
      g.fillRect(14, 20, 4, 12);
      g.fillStyle(PALETTE.wood);
      g.fillRect(2, 2, 28, 20);
      g.fillStyle(0x557755);
      g.fillRect(4, 4, 24, 16);
    });

    tex(scene, 'node_coffee_machine', 32, 32, (g) => {
      g.fillStyle(PALETTE.metalDark);
      g.fillRect(6, 4, 20, 24);
      g.fillStyle(PALETTE.metal);
      g.fillRect(8, 6, 16, 20);
      g.fillStyle(PALETTE.coffeeBrown);
      g.fillRect(10, 8, 12, 8);
      g.fillStyle(PALETTE.red);
      g.fillRect(10, 20, 4, 3);
      g.fillStyle(PALETTE.green);
      g.fillRect(16, 20, 4, 3);
    });

    tex(scene, 'node_coffee_machine_depleted', 32, 32, (g) => {
      g.fillStyle(PALETTE.metalDark);
      g.fillRect(6, 4, 20, 24);
      g.fillStyle(PALETTE.metal);
      g.fillRect(8, 6, 16, 20);
      g.fillStyle(0x555555);
      g.fillRect(10, 8, 12, 8);
      g.fillStyle(0x444444);
      g.fillRect(10, 20, 4, 3);
      g.fillRect(16, 20, 4, 3);
    });

    tex(scene, 'node_networking', 32, 32, (g) => {
      g.fillStyle(PALETTE.woodDark);
      g.fillRect(4, 24, 4, 8);
      g.fillRect(24, 24, 4, 8);
      g.fillStyle(PALETTE.wood);
      g.fillRect(2, 14, 28, 12);
      g.fillStyle(PALETTE.deskTop);
      g.fillRect(3, 15, 26, 10);
      g.fillStyle(PALETTE.contactBlue);
      g.fillRect(6, 16, 6, 4);
      g.fillRect(14, 17, 5, 3);
      g.fillStyle(PALETTE.paper);
      g.fillRect(22, 16, 4, 5);
    });

    tex(scene, 'node_networking_depleted', 32, 32, (g) => {
      g.fillStyle(PALETTE.woodDark);
      g.fillRect(4, 24, 4, 8);
      g.fillRect(24, 24, 4, 8);
      g.fillStyle(PALETTE.wood);
      g.fillRect(2, 14, 28, 12);
      g.fillStyle(PALETTE.deskTop);
      g.fillRect(3, 15, 26, 10);
    });
  }

  static _generateDrops(scene) {
    tex(scene, 'drop_script', 12, 12, (g) => {
      g.fillStyle(PALETTE.paper);
      g.fillRect(2, 1, 8, 10);
      g.fillStyle(PALETTE.paperLine);
      g.fillRect(3, 3, 5, 1);
      g.fillRect(3, 5, 6, 1);
      g.fillRect(3, 7, 4, 1);
    });

    tex(scene, 'drop_idea', 12, 12, (g) => {
      g.fillStyle(PALETTE.ideaYellow);
      g.fillCircle(6, 5, 4);
      g.fillStyle(PALETTE.ideaGlow);
      g.fillCircle(6, 4, 2);
      g.fillStyle(PALETTE.ideaYellow);
      g.fillRect(5, 9, 2, 3);
    });

    tex(scene, 'drop_coffee', 12, 12, (g) => {
      g.fillStyle(PALETTE.coffeeLight);
      g.fillRect(3, 3, 6, 8);
      g.fillStyle(PALETTE.coffeeBrown);
      g.fillRect(4, 4, 4, 3);
      g.fillStyle(PALETTE.white);
      g.fillRect(9, 5, 2, 4);
    });

    tex(scene, 'drop_contact', 12, 12, (g) => {
      g.fillStyle(PALETTE.contactBlue);
      g.fillRect(1, 2, 10, 7);
      g.fillStyle(PALETTE.white);
      g.fillRect(2, 3, 3, 2);
      g.fillRect(6, 4, 4, 1);
      g.fillRect(6, 6, 3, 1);
    });

    tex(scene, 'drop_coin', 12, 12, (g) => {
      g.fillStyle(PALETTE.coin);
      g.fillCircle(6, 6, 5);
      g.fillStyle(PALETTE.coinDark);
      g.fillCircle(6, 6, 3);
      g.fillStyle(PALETTE.coin);
      g.fillRect(5, 4, 2, 4);
    });

    tex(scene, 'drop_pitch', 12, 12, (g) => {
      g.fillStyle(PALETTE.pitchOrange);
      g.fillRect(2, 1, 8, 10);
      g.fillStyle(PALETTE.white);
      g.fillRect(3, 3, 6, 1);
      g.fillRect(3, 5, 5, 1);
      g.fillStyle(PALETTE.ideaYellow);
      g.fillRect(7, 7, 3, 3);
    });

    tex(scene, 'drop_project', 12, 12, (g) => {
      g.fillStyle(PALETTE.projectPurple);
      g.fillRect(1, 1, 10, 10);
      g.fillStyle(PALETTE.white);
      g.fillRect(3, 3, 2, 2);
      g.fillRect(7, 3, 2, 2);
      g.fillRect(3, 7, 6, 1);
    });

    tex(scene, 'drop_xp', 10, 10, (g) => {
      g.fillStyle(PALETTE.xpOrange);
      g.fillCircle(5, 5, 4);
      g.fillStyle(PALETTE.xpGlow);
      g.fillCircle(5, 4, 2);
    });
  }

  static _generateDesk(scene) {
    tex(scene, 'desk', 48, 36, (g) => {
      g.fillStyle(PALETTE.deskLeg);
      g.fillRect(4, 24, 4, 12);
      g.fillRect(40, 24, 4, 12);
      g.fillStyle(PALETTE.wood);
      g.fillRect(0, 14, 48, 12);
      g.fillStyle(PALETTE.deskTop);
      g.fillRect(1, 15, 46, 10);
      g.fillStyle(PALETTE.paper);
      g.fillRect(6, 16, 10, 7);
      g.fillStyle(PALETTE.paperLine);
      g.fillRect(7, 18, 7, 1);
      g.fillRect(7, 20, 5, 1);
      g.fillStyle(PALETTE.metal);
      g.fillRect(30, 16, 8, 6);
      g.fillStyle(PALETTE.floor);
      g.fillRect(31, 17, 6, 4);
    });
  }

  static _generateUI(scene) {
    tex(scene, 'ui_slot', 40, 40, (g) => {
      g.fillStyle(PALETTE.uiPanel);
      g.fillRect(0, 0, 40, 40);
      g.lineStyle(1, PALETTE.uiBorder, 0.5);
      g.strokeRect(1, 1, 38, 38);
    });

    tex(scene, 'ui_slot_highlight', 40, 40, (g) => {
      g.fillStyle(0x3d3d54);
      g.fillRect(0, 0, 40, 40);
      g.lineStyle(2, PALETTE.uiBorder, 1);
      g.strokeRect(1, 1, 38, 38);
    });

    tex(scene, 'btn_craft', 120, 32, (g) => {
      g.fillStyle(PALETTE.uiBorder);
      g.fillRoundedRect(0, 0, 120, 32, 4);
    });

    tex(scene, 'btn_craft_disabled', 120, 32, (g) => {
      g.fillStyle(0x555566);
      g.fillRoundedRect(0, 0, 120, 32, 4);
    });

    tex(scene, 'ui_xp_bg', 200, 8, (g) => {
      g.fillStyle(0x222244);
      g.fillRoundedRect(0, 0, 200, 8, 3);
    });

    tex(scene, 'ui_xp_fill', 200, 8, (g) => {
      g.fillStyle(PALETTE.uiBorder);
      g.fillRoundedRect(0, 0, 200, 8, 3);
    });
  }

  static _generateDecorations(scene) {
    tex(scene, 'deco_tree', 24, 32, (g) => {
      g.fillStyle(PALETTE.woodDark);
      g.fillRect(10, 18, 4, 14);
      g.fillStyle(0x2d6b3f);
      g.fillCircle(12, 12, 10);
      g.fillStyle(0x3d8b4f);
      g.fillCircle(12, 10, 7);
    });

    tex(scene, 'deco_bush', 20, 14, (g) => {
      g.fillStyle(0x3d7a4e);
      g.fillCircle(10, 8, 8);
      g.fillStyle(0x4a9060);
      g.fillCircle(10, 6, 5);
    });

    tex(scene, 'deco_flower', 10, 12, (g) => {
      g.fillStyle(0x3d7a4e);
      g.fillRect(4, 6, 2, 6);
      g.fillStyle(0xff6688);
      g.fillCircle(5, 4, 3);
      g.fillStyle(0xffaacc);
      g.fillCircle(5, 3, 1);
    });
  }

  static _generateEffects(scene) {
    tex(scene, 'particle_spark', 6, 6, (g) => {
      g.fillStyle(PALETTE.spark);
      g.fillRect(2, 0, 2, 6);
      g.fillRect(0, 2, 6, 2);
    });

    tex(scene, 'particle_hit', 8, 8, (g) => {
      g.fillStyle(PALETTE.white);
      g.fillCircle(4, 4, 3);
      g.fillStyle(PALETTE.spark);
      g.fillCircle(4, 4, 2);
    });

    tex(scene, 'swing_arc', 24, 24, (g) => {
      g.lineStyle(3, PALETTE.white, 0.7);
      g.beginPath();
      g.arc(12, 12, 10, -1.2, 0.8, false);
      g.strokePath();
    });
  }

  static _generateLand(scene) {
    tex(scene, 'land_locked', 32, 32, (g) => {
      g.fillStyle(PALETTE.locked);
      g.fillRect(0, 0, 32, 32);
      g.fillStyle(PALETTE.lockedEdge);
      g.fillRect(0, 0, 32, 1);
      g.fillRect(0, 31, 32, 1);
      g.fillRect(0, 0, 1, 32);
      g.fillRect(31, 0, 1, 32);
      g.fillRect(8, 8, 2, 2);
      g.fillRect(22, 14, 2, 2);
      g.fillRect(14, 22, 2, 2);
    });

    tex(scene, 'land_buy_icon', 48, 48, (g) => {
      g.fillStyle(PALETTE.coin);
      g.fillCircle(24, 24, 16);
      g.fillStyle(PALETTE.coinDark);
      g.fillCircle(24, 24, 12);
      g.fillStyle(PALETTE.coin);
      g.fillRect(22, 16, 4, 16);
      g.fillRect(18, 20, 12, 4);
    });

    tex(scene, 'land_border', 384, 384, (g) => {
      g.lineStyle(2, PALETTE.grassDark, 0.6);
      g.strokeRect(1, 1, 382, 382);
    });
  }
}

export { PALETTE };
