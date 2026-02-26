import Phaser from 'phaser';
import { SaveSystem } from '../utils/SaveSystem.js';
import { getStageHP, getStageCoinReward, isBossStage, getBossTimerSec, getExecName, getExecTier } from '../data/stageData.js';
import { CREW_MEMBERS, getCrewHireCost, getCrewDPS, getTotalDPS } from '../data/crewData.js';
import { SKILLS, isSkillActive } from '../data/skillData.js';
import { canPrestige, getPrestigeStarPower } from '../data/prestigeData.js';
import { SFX } from '../utils/SoundGenerator.js';

const TAP_UPGRADE_BASE_COST = 5;
const TAP_UPGRADE_SCALE = 1.07;
const SAVE_INTERVAL = 15000;

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init(data) {
    this.loadSave = data?.loadSave ?? false;
  }

  create() {
    if (this.loadSave) {
      this.gameState = SaveSystem.load() ?? SaveSystem.getDefaultState();
    } else {
      this.gameState = SaveSystem.getDefaultState();
    }

    this.enemyHP = 0;
    this.enemyMaxHP = 0;
    this.bossTimer = 0;
    this.saveTimer = 0;
    this.dpsTickTimer = 0;

    this._buildBackground();
    this._spawnEnemy();
    this._setupInput();

    this.scene.launch('UIScene', { gameScene: this });
  }

  _buildBackground() {
    this.add.image(480, 180, 'bg_office').setDepth(0);
    this.add.rectangle(480, 500, 960, 280, 0x1a1a2e).setDepth(0);
  }

  // ===== ENEMY =====

  _spawnEnemy() {
    const stage = this.gameState.stage;
    this.enemyMaxHP = getStageHP(stage);
    this.enemyHP = this.enemyMaxHP;
    this.isBoss = isBossStage(stage);

    if (this.isBoss) {
      this.bossTimer = getBossTimerSec() * 1000;
    } else {
      this.bossTimer = 0;
    }

    const tier = Math.min(getExecTier(stage), 4);
    const texKey = this.isBoss ? `exec_${tier}_boss` : `exec_${tier}`;
    const name = getExecName(stage);

    if (this.enemySprite) {
      this.enemySprite.destroy();
    }
    if (this.enemyNameText) {
      this.enemyNameText.destroy();
    }

    this.enemySprite = this.add.image(480, 220, texKey)
      .setDepth(3)
      .setScale(this.isBoss ? 2.5 : 2)
      .setInteractive({ useHandCursor: true });

    this.enemyNameText = this.add.text(480, 310, name, {
      fontSize: '11px',
      fontFamily: 'monospace',
      color: this.isBoss ? '#FFD700' : '#F5E6CC',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(4);

    const targetScale = this.isBoss ? 2.5 : 2;
    this.tweens.add({
      targets: this.enemySprite,
      scaleX: { from: 0, to: targetScale },
      scaleY: { from: 0, to: targetScale },
      duration: 300,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.tweens.add({
          targets: this.enemySprite,
          y: { from: 218, to: 222 },
          duration: 1200,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
      },
    });

    if (this.isBoss) {
      this.cameras.main.flash(300, 255, 50, 50, false);
      this._showFloatingText(480, 160, 'BOSS FIGHT!', '#FF4444');
    }

    this.events.emit('enemy-changed');
  }

  // ===== INPUT =====

  _setupInput() {
    this.input.on('pointerdown', (pointer) => {
      if (pointer.y < 360) {
        this._onTap(pointer.x, pointer.y);
      }
    });
  }

  _onTap(x, y) {
    if (this.enemyHP <= 0) return;

    const starPower = this.gameState.prestige?.starPower ?? 1;
    let damage = this.gameState.tapDamage * starPower;

    const now = Date.now();
    const skills = this.gameState.skills;

    const viralState = skills.viralMarketing;
    const viralDef = SKILLS.find(s => s.id === 'viralMarketing');
    if (viralDef && isSkillActive(viralState, now)) {
      damage *= viralDef.effect.tapMultiplier;
    }

    const powerState = skills.powerPitch;
    const powerDef = SKILLS.find(s => s.id === 'powerPitch');
    if (powerDef && isSkillActive(powerState, now)) {
      damage *= powerDef.effect.critMultiplier;
    }

    this._dealDamage(damage, x, y);
    SFX.tap();
  }

  _dealDamage(damage, x, y) {
    const actual = Math.min(damage, this.enemyHP);
    this.enemyHP -= actual;

    this._showDamageNumber(x, y, damage);
    this._hitEffect();

    this.events.emit('hp-changed', this.enemyHP, this.enemyMaxHP);

    if (this.enemyHP <= 0) {
      this._onEnemyKilled();
    }
  }

  _hitEffect() {
    if (!this.enemySprite) return;
    this.tweens.add({
      targets: this.enemySprite,
      scaleX: this.enemySprite.scaleX * 0.9,
      scaleY: this.enemySprite.scaleY * 1.1,
      duration: 50,
      yoyo: true,
      ease: 'Sine.easeOut',
    });

    this.enemySprite.setTint(0xff4444);
    this.time.delayedCall(60, () => {
      if (this.enemySprite?.active) this.enemySprite.clearTint();
    });
  }

  _showDamageNumber(x, y, amount) {
    const text = formatNumber(Math.floor(amount));
    const ft = this.add.text(x + Phaser.Math.Between(-20, 20), y - 10, text, {
      fontSize: amount > this.gameState.tapDamage * 2 ? '14px' : '10px',
      fontFamily: 'monospace',
      color: amount > this.gameState.tapDamage * 2 ? '#FF4444' : '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(10);

    this.tweens.add({
      targets: ft,
      y: ft.y - 40,
      alpha: { from: 1, to: 0 },
      duration: 600,
      ease: 'Power2',
      onComplete: () => ft.destroy(),
    });
  }

  _onEnemyKilled() {
    const stage = this.gameState.stage;
    const coins = getStageCoinReward(stage);
    const starPower = this.gameState.prestige?.starPower ?? 1;
    const totalReward = Math.floor(coins * starPower);

    this.gameState.coins += totalReward;
    this.gameState.totalCoins += totalReward;

    this._spawnCoinParticles(480, 220, Math.min(totalReward, 12));
    this._showFloatingText(480, 180, `+${formatNumber(totalReward)} coins`, '#FFD700');

    if (this.isBoss) {
      SFX.bossKill();
      this.cameras.main.shake(300, 0.015);
    } else {
      SFX.kill();
      this.cameras.main.shake(100, 0.006);
    }

    this._killAnimation(() => {
      this.gameState.stage++;
      if (this.gameState.stage > this.gameState.maxStage) {
        this.gameState.maxStage = this.gameState.stage;
      }
      this.events.emit('coins-changed');
      this._spawnEnemy();
    });
  }

  _killAnimation(onComplete) {
    if (!this.enemySprite) { onComplete(); return; }

    this._spawnBreakParticles(this.enemySprite.x, this.enemySprite.y);

    if (this.isBoss) {
      this._spawnStarParticles(this.enemySprite.x, this.enemySprite.y);
    }

    this.tweens.killTweensOf(this.enemySprite);
    this.tweens.add({
      targets: [this.enemySprite, this.enemyNameText],
      alpha: 0,
      scaleX: 0,
      scaleY: 0,
      angle: { from: 0, to: this.isBoss ? 360 : 0 },
      duration: this.isBoss ? 500 : 250,
      ease: 'Power3',
      onComplete,
    });
  }

  _spawnStarParticles(x, y) {
    for (let i = 0; i < 12; i++) {
      const p = this.add.image(x, y, 'particle_star').setDepth(9);
      const angle = (i / 12) * Math.PI * 2;
      const dist = 40 + Math.random() * 60;
      this.tweens.add({
        targets: p,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist - 30,
        alpha: { from: 1, to: 0 },
        scaleX: { from: 2, to: 0 },
        scaleY: { from: 2, to: 0 },
        duration: 600 + Math.random() * 300,
        ease: 'Power2',
        onComplete: () => p.destroy(),
      });
    }
  }

  _onBossTimeout() {
    this.gameState.stage = Math.max(1, this.gameState.stage - 1);
    SFX.bossFail();
    this._showFloatingText(480, 200, 'TIME UP!', '#FF4444');
    this.cameras.main.shake(200, 0.01);

    this.time.delayedCall(500, () => {
      this._spawnEnemy();
    });
  }

  // ===== PASSIVE DPS =====

  _applyDPS(delta) {
    const starPower = this.gameState.prestige?.starPower ?? 1;
    let dps = getTotalDPS(this.gameState.crew, starPower);

    const now = Date.now();
    const coffeeState = this.gameState.skills.coffeeRush;
    const coffeeDef = SKILLS.find(s => s.id === 'coffeeRush');
    if (coffeeDef && isSkillActive(coffeeState, now)) {
      dps *= coffeeDef.effect.dpsMultiplier;
    }

    if (dps <= 0) return;

    const damage = dps * (delta / 1000);
    if (damage > 0 && this.enemyHP > 0) {
      this.enemyHP -= damage;
      this.events.emit('hp-changed', this.enemyHP, this.enemyMaxHP);

      this.dpsTickTimer += delta;
      if (this.dpsTickTimer >= 500) {
        this.dpsTickTimer = 0;
        const tickDmg = dps * 0.5;
        const dx = Phaser.Math.Between(-40, 40);
        this._showDPSNumber(480 + dx, 250, tickDmg);
      }

      if (this.enemyHP <= 0) {
        this.enemyHP = 0;
        this._onEnemyKilled();
      }
    }
  }

  _showDPSNumber(x, y, amount) {
    const ft = this.add.text(x, y, formatNumber(Math.floor(amount)), {
      fontSize: '8px',
      fontFamily: 'monospace',
      color: '#88CCFF',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5).setDepth(9);

    this.tweens.add({
      targets: ft,
      y: y - 25,
      alpha: { from: 0.8, to: 0 },
      duration: 500,
      ease: 'Power2',
      onComplete: () => ft.destroy(),
    });
  }

  // ===== SKILLS =====

  activateSkill(skillId) {
    const skillDef = SKILLS.find(s => s.id === skillId);
    if (!skillDef) return false;

    const state = this.gameState.skills[skillId];
    const now = Date.now();

    if (state?.lastUsed && (now - state.lastUsed) < skillDef.cooldownSec * 1000) {
      return false;
    }

    this.gameState.skills[skillId] = { id: skillId, lastUsed: now };
    SFX.skill();

    if (skillDef.effect.instantDPS) {
      const starPower = this.gameState.prestige?.starPower ?? 1;
      const dps = getTotalDPS(this.gameState.crew, starPower);
      const damage = dps * skillDef.effect.instantDPS;
      if (damage > 0 && this.enemyHP > 0) {
        this._dealDamage(damage, 480, 220);
      }
    }

    this.events.emit('skill-activated', skillId);
    return true;
  }

  // ===== UPGRADES =====

  getTapUpgradeCost() {
    return Math.floor(TAP_UPGRADE_BASE_COST * Math.pow(TAP_UPGRADE_SCALE, this.gameState.tapLevel - 1));
  }

  upgradeTap() {
    const cost = this.getTapUpgradeCost();
    if (this.gameState.coins < cost) return false;

    this.gameState.coins -= cost;
    this.gameState.tapLevel++;
    this.gameState.tapDamage = this.gameState.tapLevel;
    this.events.emit('coins-changed');
    SFX.hire();
    return true;
  }

  hireCrew(crewId) {
    const def = CREW_MEMBERS.find(c => c.id === crewId);
    if (!def) return false;

    const state = this.gameState.crew.find(c => c.id === crewId);
    if (!state) return false;

    if (this.gameState.maxStage < def.unlockStage) return false;

    const cost = getCrewHireCost(def, state.level);
    if (this.gameState.coins < cost) return false;

    this.gameState.coins -= cost;
    state.level++;
    this.events.emit('coins-changed');
    SFX.hire();
    return true;
  }

  // ===== PRESTIGE =====

  doPrestige() {
    if (!canPrestige(this.gameState.maxStage)) return false;

    const earned = getPrestigeStarPower(this.gameState.maxStage);
    if (earned <= 0) return false;

    SFX.prestige();

    this.gameState.prestige.count++;
    this.gameState.prestige.starPower += earned;
    this.gameState.prestige.totalStarPower += earned;

    this.gameState.stage = 1;
    this.gameState.maxStage = 1;
    this.gameState.coins = 0;
    this.gameState.tapLevel = 1;
    this.gameState.tapDamage = 1;
    for (const c of this.gameState.crew) {
      c.level = 0;
    }

    this.cameras.main.flash(800, 200, 150, 255);
    this.events.emit('coins-changed');
    this._spawnEnemy();
    return true;
  }

  // ===== PARTICLES & EFFECTS =====

  _spawnCoinParticles(x, y, count) {
    for (let i = 0; i < count; i++) {
      const p = this.add.image(x, y, 'particle_coin').setDepth(9);
      const angle = (i / count) * Math.PI * 2;
      const dist = 30 + Math.random() * 40;
      this.tweens.add({
        targets: p,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist - 20,
        alpha: 0,
        scaleX: { from: 2, to: 0 },
        scaleY: { from: 2, to: 0 },
        duration: 400 + Math.random() * 200,
        ease: 'Power3',
        onComplete: () => p.destroy(),
      });
    }
  }

  _spawnBreakParticles(x, y) {
    for (let i = 0; i < 8; i++) {
      const p = this.add.image(x, y, 'particle_spark').setDepth(9);
      const angle = (i / 8) * Math.PI * 2;
      const dist = 20 + Math.random() * 30;
      this.tweens.add({
        targets: p,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist - 15,
        alpha: 0,
        scaleX: { from: 1.5, to: 0 },
        scaleY: { from: 1.5, to: 0 },
        duration: 350 + Math.random() * 150,
        ease: 'Power3',
        onComplete: () => p.destroy(),
      });
    }
  }

  _showFloatingText(x, y, text, color) {
    const ft = this.add.text(x, y, text, {
      fontSize: '12px',
      fontFamily: 'monospace',
      color,
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(10);

    this.tweens.add({
      targets: ft,
      y: y - 35,
      alpha: { from: 1, to: 0 },
      duration: 900,
      ease: 'Power2',
      onComplete: () => ft.destroy(),
    });
  }

  // ===== UPDATE =====

  update(_time, delta) {
    this._applyDPS(delta);

    if (this.isBoss && this.enemyHP > 0) {
      this.bossTimer -= delta;
      this.events.emit('boss-timer', this.bossTimer, getBossTimerSec() * 1000);
      if (this.bossTimer <= 0) {
        this._onBossTimeout();
      }
    }

    this.saveTimer += delta;
    if (this.saveTimer >= SAVE_INTERVAL) {
      this.saveTimer = 0;
      SaveSystem.save(this.gameState);
    }
  }
}

function formatNumber(n) {
  if (n < 1000) return Math.floor(n).toString();
  if (n < 1e6) return (n / 1000).toFixed(1) + 'K';
  if (n < 1e9) return (n / 1e6).toFixed(1) + 'M';
  if (n < 1e12) return (n / 1e9).toFixed(1) + 'B';
  return (n / 1e12).toFixed(1) + 'T';
}

export { formatNumber };
