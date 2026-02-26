const PALETTE = {
  skin: 0xf5c6a0,
  skinDark: 0xd4a67a,
  shirt: 0x3366cc,
  shirtDark: 0x224488,
  suit: 0x334455,
  suitDark: 0x222233,
  hair: 0x553322,
  hairDark: 0x3a2211,
  tie: 0xcc3333,
  tieGold: 0xffd700,
  paper: 0xfff5e1,
  paperLine: 0xccc4b4,
  wood: 0x8b6914,
  woodDark: 0x5c3a1e,
  metal: 0x999999,
  metalDark: 0x666666,
  coffeeBrown: 0x6d4c2f,
  coffeeLight: 0x8d6e63,
  coin: 0xffd700,
  coinDark: 0xdaa520,
  uiPanel: 0x1a1a2e,
  uiPanelLight: 0x2d2d44,
  uiBorder: 0xe8913a,
  uiText: 0xfff5e1,
  hpRed: 0xdd3333,
  hpRedDark: 0x991111,
  hpGreen: 0x44cc44,
  hpBg: 0x222233,
  white: 0xffffff,
  black: 0x000000,
  red: 0xff4444,
  green: 0x44cc44,
  spark: 0xffffaa,
  blue: 0x4488ff,
  purple: 0xab47bc,
  orange: 0xff8844,
  cyan: 0x44dddd,
  bgSky: 0x1a1a2e,
  bgFloor: 0x2d2d44,
  bgWall: 0x252540,
};

function tex(scene, key, w, h, fn) {
  const g = scene.make.graphics({ add: false });
  fn(g);
  g.generateTexture(key, w, h);
  g.destroy();
}

export class TextureGenerator {
  static generateAll(scene) {
    this._generateExecs(scene);
    this._generateCrewIcons(scene);
    this._generateSkillIcons(scene);
    this._generateUI(scene);
    this._generateEffects(scene);
    this._generateBackground(scene);
  }

  static _generateExecs(scene) {
    const tiers = [
      { key: 'exec_0', suitColor: 0x555566, tieColor: 0x888899, size: 48 },
      { key: 'exec_1', suitColor: 0x445566, tieColor: 0x4488cc, size: 52 },
      { key: 'exec_2', suitColor: 0x334455, tieColor: 0xcc3333, size: 56 },
      { key: 'exec_3', suitColor: 0x222244, tieColor: 0xffd700, size: 60 },
      { key: 'exec_4', suitColor: 0x111122, tieColor: 0xff4444, size: 64 },
    ];

    for (const t of tiers) {
      const s = t.size;
      tex(scene, t.key, s, s, (g) => {
        const cx = s / 2;
        g.fillStyle(t.suitColor);
        g.fillRect(cx - s * 0.3, s * 0.45, s * 0.6, s * 0.55);

        g.fillStyle(PALETTE.skin);
        g.fillCircle(cx, s * 0.28, s * 0.18);

        g.fillStyle(PALETTE.hair);
        g.fillRect(cx - s * 0.18, s * 0.08, s * 0.36, s * 0.12);

        g.fillStyle(t.tieColor);
        g.fillRect(cx - 2, s * 0.45, 4, s * 0.25);

        g.fillStyle(PALETTE.black);
        g.fillRect(cx - s * 0.08, s * 0.24, 3, 3);
        g.fillRect(cx + s * 0.04, s * 0.24, 3, 3);

        g.fillStyle(PALETTE.white);
        g.fillRect(cx - s * 0.22, s * 0.5, s * 0.14, s * 0.08);
        g.fillRect(cx + s * 0.08, s * 0.5, s * 0.14, s * 0.08);
      });

      tex(scene, t.key + '_boss', s + 16, s + 16, (g) => {
        const bs = s + 16;
        const cx = bs / 2;

        g.fillStyle(0xffd700);
        g.fillTriangle(cx, 2, cx - 10, 14, cx + 10, 14);
        g.fillRect(cx - 12, 14, 24, 4);
        g.fillCircle(cx - 8, 12, 2);
        g.fillCircle(cx, 6, 2);
        g.fillCircle(cx + 8, 12, 2);

        g.fillStyle(t.suitColor);
        g.fillRect(cx - s * 0.32, bs * 0.42, s * 0.64, s * 0.58);

        g.fillStyle(PALETTE.skin);
        g.fillCircle(cx, bs * 0.28, s * 0.2);

        g.fillStyle(PALETTE.hair);
        g.fillRect(cx - s * 0.2, bs * 0.1, s * 0.4, s * 0.14);

        g.fillStyle(t.tieColor);
        g.fillRect(cx - 3, bs * 0.42, 6, s * 0.28);

        g.fillStyle(PALETTE.black);
        g.fillRect(cx - s * 0.1, bs * 0.24, 4, 4);
        g.fillRect(cx + s * 0.04, bs * 0.24, 4, 4);

        g.fillStyle(PALETTE.white);
        g.fillRect(cx - s * 0.24, bs * 0.48, s * 0.16, s * 0.1);
        g.fillRect(cx + s * 0.1, bs * 0.48, s * 0.16, s * 0.1);
      });
    }
  }

  static _generateCrewIcons(scene) {
    const crews = [
      { id: 'crew_intern', color: 0x90caf9, hat: false },
      { id: 'crew_writer', color: 0xfff59d, hat: false },
      { id: 'crew_editor', color: 0xa5d6a7, hat: false },
      { id: 'crew_director', color: 0xce93d8, hat: true },
      { id: 'crew_producer', color: 0xffab91, hat: false },
      { id: 'crew_star', color: 0xffd54f, hat: false },
      { id: 'crew_composer', color: 0x80deea, hat: false },
      { id: 'crew_showrunner', color: 0xef9a9a, hat: true },
    ];

    for (const c of crews) {
      tex(scene, c.id, 24, 24, (g) => {
        g.fillStyle(c.color);
        g.fillCircle(12, 10, 8);

        g.fillStyle(PALETTE.skin);
        g.fillCircle(12, 10, 5);

        g.fillStyle(PALETTE.black);
        g.fillRect(10, 9, 2, 2);
        g.fillRect(14, 9, 2, 2);

        g.fillStyle(c.color);
        g.fillRect(6, 16, 12, 8);

        if (c.hat) {
          g.fillStyle(PALETTE.black);
          g.fillRect(6, 2, 12, 4);
          g.fillRect(4, 5, 16, 2);
        }
      });
    }
  }

  static _generateSkillIcons(scene) {
    tex(scene, 'skill_coffee', 28, 28, (g) => {
      g.fillStyle(PALETTE.coffeeLight);
      g.fillRect(8, 8, 12, 14);
      g.fillStyle(PALETTE.coffeeBrown);
      g.fillRect(10, 10, 8, 6);
      g.fillStyle(PALETTE.white);
      g.fillRect(20, 11, 4, 6);
      g.fillStyle(0xdddddd);
      g.fillRect(11, 4, 2, 5);
      g.fillRect(15, 3, 2, 6);
    });

    tex(scene, 'skill_viral', 28, 28, (g) => {
      g.fillStyle(0x4fc3f7);
      g.fillCircle(14, 14, 10);
      g.fillStyle(0x29b6f6);
      g.fillCircle(14, 14, 6);
      g.fillStyle(PALETTE.white);
      g.fillRect(12, 4, 4, 6);
      g.fillRect(4, 12, 6, 4);
      g.fillRect(18, 12, 6, 4);
      g.fillRect(12, 18, 4, 6);
    });

    tex(scene, 'skill_power', 28, 28, (g) => {
      g.fillStyle(0xff7043);
      g.fillTriangle(14, 2, 8, 16, 14, 12);
      g.fillTriangle(14, 12, 20, 16, 14, 26);
      g.fillStyle(0xffab91);
      g.fillTriangle(14, 5, 10, 14, 14, 12);
    });

    tex(scene, 'skill_brain', 28, 28, (g) => {
      g.fillStyle(0xce93d8);
      g.fillCircle(11, 12, 7);
      g.fillCircle(17, 12, 7);
      g.fillStyle(0xba68c8);
      g.fillCircle(11, 11, 4);
      g.fillCircle(17, 11, 4);
      g.fillStyle(0xab47bc);
      g.fillRect(12, 8, 4, 10);
    });
  }

  static _generateUI(scene) {
    tex(scene, 'hp_bar_bg', 200, 16, (g) => {
      g.fillStyle(PALETTE.hpBg);
      g.fillRoundedRect(0, 0, 200, 16, 4);
      g.lineStyle(1, 0x444466, 0.8);
      g.strokeRoundedRect(0, 0, 200, 16, 4);
    });

    tex(scene, 'hp_bar_fill', 196, 12, (g) => {
      g.fillStyle(PALETTE.hpRed);
      g.fillRoundedRect(0, 0, 196, 12, 3);
      g.fillStyle(0xff5555);
      g.fillRect(2, 2, 192, 4);
    });

    tex(scene, 'boss_timer_bg', 160, 10, (g) => {
      g.fillStyle(0x222233);
      g.fillRoundedRect(0, 0, 160, 10, 3);
    });

    tex(scene, 'boss_timer_fill', 156, 6, (g) => {
      g.fillStyle(0xff6644);
      g.fillRoundedRect(0, 0, 156, 6, 2);
    });

    tex(scene, 'btn_upgrade', 200, 36, (g) => {
      g.fillStyle(PALETTE.uiBorder);
      g.fillRoundedRect(0, 0, 200, 36, 6);
    });

    tex(scene, 'btn_upgrade_disabled', 200, 36, (g) => {
      g.fillStyle(0x444455);
      g.fillRoundedRect(0, 0, 200, 36, 6);
    });

    tex(scene, 'btn_skill', 48, 48, (g) => {
      g.fillStyle(PALETTE.uiPanelLight);
      g.fillRoundedRect(0, 0, 48, 48, 6);
      g.lineStyle(2, PALETTE.uiBorder, 0.6);
      g.strokeRoundedRect(1, 1, 46, 46, 6);
    });

    tex(scene, 'btn_skill_active', 48, 48, (g) => {
      g.fillStyle(0x44aa44);
      g.fillRoundedRect(0, 0, 48, 48, 6);
      g.lineStyle(2, 0x66ff66, 0.8);
      g.strokeRoundedRect(1, 1, 46, 46, 6);
    });

    tex(scene, 'btn_skill_cooldown', 48, 48, (g) => {
      g.fillStyle(0x222233);
      g.fillRoundedRect(0, 0, 48, 48, 6);
      g.lineStyle(1, 0x555566, 0.4);
      g.strokeRoundedRect(1, 1, 46, 46, 6);
    });

    tex(scene, 'crew_row_bg', 400, 44, (g) => {
      g.fillStyle(PALETTE.uiPanelLight);
      g.fillRoundedRect(0, 0, 400, 44, 4);
      g.lineStyle(1, 0x444466, 0.4);
      g.strokeRoundedRect(0, 0, 400, 44, 4);
    });

    tex(scene, 'btn_hire', 70, 28, (g) => {
      g.fillStyle(0x44aa44);
      g.fillRoundedRect(0, 0, 70, 28, 4);
    });

    tex(scene, 'btn_hire_disabled', 70, 28, (g) => {
      g.fillStyle(0x444455);
      g.fillRoundedRect(0, 0, 70, 28, 4);
    });

    tex(scene, 'btn_prestige', 160, 36, (g) => {
      g.fillStyle(0x9933cc);
      g.fillRoundedRect(0, 0, 160, 36, 6);
      g.lineStyle(2, 0xcc66ff, 0.7);
      g.strokeRoundedRect(1, 1, 158, 34, 6);
    });

    tex(scene, 'drop_coin', 12, 12, (g) => {
      g.fillStyle(PALETTE.coin);
      g.fillCircle(6, 6, 5);
      g.fillStyle(PALETTE.coinDark);
      g.fillCircle(6, 6, 3);
      g.fillStyle(PALETTE.coin);
      g.fillRect(5, 4, 2, 4);
    });

    tex(scene, 'panel_bg', 440, 240, (g) => {
      g.fillStyle(PALETTE.uiPanel, 0.95);
      g.fillRoundedRect(0, 0, 440, 240, 8);
      g.lineStyle(2, PALETTE.uiBorder, 0.5);
      g.strokeRoundedRect(1, 1, 438, 238, 8);
    });

    tex(scene, 'star_filled', 14, 14, (g) => {
      g.fillStyle(PALETTE.coin);
      g.fillTriangle(7, 0, 5, 5, 0, 5);
      g.fillTriangle(7, 0, 9, 5, 14, 5);
      g.fillTriangle(1, 9, 5, 5, 7, 12);
      g.fillTriangle(13, 9, 9, 5, 7, 12);
      g.fillTriangle(5, 5, 9, 5, 7, 12);
      g.fillStyle(PALETTE.coinDark);
      g.fillRect(6, 3, 2, 2);
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

    tex(scene, 'particle_coin', 8, 8, (g) => {
      g.fillStyle(PALETTE.coin);
      g.fillCircle(4, 4, 3);
      g.fillStyle(PALETTE.coinDark);
      g.fillCircle(4, 4, 2);
    });

    tex(scene, 'particle_star', 10, 10, (g) => {
      g.fillStyle(0xffdd44);
      g.fillTriangle(5, 0, 4, 4, 0, 4);
      g.fillTriangle(5, 0, 6, 4, 10, 4);
      g.fillTriangle(1, 7, 4, 4, 5, 9);
      g.fillTriangle(9, 7, 6, 4, 5, 9);
      g.fillTriangle(4, 4, 6, 4, 5, 9);
    });
  }

  static _generateBackground(scene) {
    tex(scene, 'bg_office', 960, 360, (g) => {
      g.fillStyle(PALETTE.bgSky);
      g.fillRect(0, 0, 960, 360);

      g.fillStyle(PALETTE.bgWall);
      g.fillRect(0, 40, 960, 280);

      g.fillStyle(0x333355);
      for (let x = 0; x < 960; x += 80) {
        g.fillRect(x, 60, 60, 80);
        g.fillStyle(0x2a2a45);
        g.fillRect(x + 4, 64, 52, 72);
        g.fillStyle(0x333355);
      }

      g.fillStyle(PALETTE.bgFloor);
      g.fillRect(0, 320, 960, 40);
      g.fillStyle(0x353550);
      g.fillRect(0, 318, 960, 4);
    });
  }
}

export { PALETTE };
