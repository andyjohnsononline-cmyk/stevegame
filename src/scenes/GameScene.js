import Phaser from 'phaser';
import { SaveSystem } from '../utils/SaveSystem.js';
import { RESOURCE_TYPES, LAND_TILE_SIZE, GRID_SIZE, WORLD_PX, getLandNodes, getLandCost } from '../data/resourceData.js';
import { RECIPES } from '../data/craftingData.js';

const TILE = 32;
const PLAYER_SPEED = 180;
const AUTO_ATTACK_RANGE = 36;
const AUTO_ATTACK_CD = 280;
const MAGNET_RANGE = 90;
const MAGNET_SPEED = 350;
const DESK_OFFSET_X = 0;
const DESK_OFFSET_Y = -40;

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

    this.physics.world.setBounds(0, 0, WORLD_PX, WORLD_PX);

    this.resourceNodes = [];
    this.landTiles = {};
    this.landBuyIcons = {};
    this.attackCooldown = 0;
    this.bobTimer = 0;
    this.nearDesk = false;
    this.craftingOpen = false;
    this.saveTimer = 0;

    this._buildWorld();
    this._createPlayer();
    this._spawnLandNodes();
    this._setupDropGroup();
    this._setupInput();

    this.cameras.main.setBounds(0, 0, WORLD_PX, WORLD_PX);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setZoom(2);

    this.scene.launch('UIScene', { gameScene: this });
  }

  // ===== WORLD BUILDING =====

  _buildWorld() {
    for (let gx = 0; gx < GRID_SIZE; gx++) {
      for (let gy = 0; gy < GRID_SIZE; gy++) {
        const key = `${gx},${gy}`;
        const ox = gx * LAND_TILE_SIZE;
        const oy = gy * LAND_TILE_SIZE;
        const unlocked = this.gameState.unlockedLands.includes(key);

        if (unlocked) {
          this._fillLandGrass(ox, oy);
        } else {
          this._fillLandLocked(ox, oy);
        }

        this.landTiles[key] = { gx, gy, unlocked };
      }
    }

    this._updateBuyIcons();

    const cx = 2.5 * LAND_TILE_SIZE;
    const cy = 2.5 * LAND_TILE_SIZE;
    this.desk = this.physics.add.staticImage(cx + DESK_OFFSET_X, cy + DESK_OFFSET_Y, 'desk').setDepth(3);
    this.desk.body.setSize(48, 20);
    this.desk.body.setOffset(0, 10);
  }

  _fillLandGrass(ox, oy) {
    for (let x = ox; x < ox + LAND_TILE_SIZE; x += TILE) {
      for (let y = oy; y < oy + LAND_TILE_SIZE; y += TILE) {
        const variant = ((x / TILE + y / TILE) % 3 === 0) ? 'tile_grass_alt' : 'tile_grass';
        this.add.image(x + TILE / 2, y + TILE / 2, variant).setDepth(0);
      }
    }

    const numFlowers = 2 + (((ox + oy) * 7) % 3);
    for (let i = 0; i < numFlowers; i++) {
      const fx = ox + 30 + ((i * 97 + ox) % (LAND_TILE_SIZE - 60));
      const fy = oy + 30 + ((i * 71 + oy) % (LAND_TILE_SIZE - 60));
      this.add.image(fx, fy, 'deco_flower').setDepth(1).setAlpha(0.7);
    }
  }

  _fillLandLocked(ox, oy) {
    for (let x = ox; x < ox + LAND_TILE_SIZE; x += TILE) {
      for (let y = oy; y < oy + LAND_TILE_SIZE; y += TILE) {
        this.add.image(x + TILE / 2, y + TILE / 2, 'land_locked').setDepth(0);
      }
    }
  }

  _updateBuyIcons() {
    for (const k of Object.keys(this.landBuyIcons)) {
      this.landBuyIcons[k].icon?.destroy();
      this.landBuyIcons[k].text?.destroy();
      this.landBuyIcons[k].glow?.destroy();
      delete this.landBuyIcons[k];
    }

    for (let gx = 0; gx < GRID_SIZE; gx++) {
      for (let gy = 0; gy < GRID_SIZE; gy++) {
        const key = `${gx},${gy}`;
        if (this.gameState.unlockedLands.includes(key)) continue;
        if (!this._isAdjacentToUnlocked(gx, gy)) continue;

        const cx = gx * LAND_TILE_SIZE + LAND_TILE_SIZE / 2;
        const cy = gy * LAND_TILE_SIZE + LAND_TILE_SIZE / 2;
        const cost = getLandCost(this.gameState.landsPurchased);

        const icon = this.add.image(cx, cy - 10, 'land_buy_icon').setDepth(8).setAlpha(0.85);
        const text = this.add.text(cx, cy + 18, `${cost}`, {
          fontSize: '10px', fontFamily: 'monospace', color: '#FFD700',
          stroke: '#000000', strokeThickness: 3,
        }).setOrigin(0.5).setDepth(8);

        this.tweens.add({
          targets: [icon],
          scaleX: { from: 0.9, to: 1.1 },
          scaleY: { from: 0.9, to: 1.1 },
          duration: 1200,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });

        this.landBuyIcons[key] = { icon, text, gx, gy, cost };
      }
    }
  }

  _isAdjacentToUnlocked(gx, gy) {
    const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];
    for (const [dx, dy] of dirs) {
      const nk = `${gx + dx},${gy + dy}`;
      if (this.gameState.unlockedLands.includes(nk)) return true;
    }
    return false;
  }

  buyLand(gx, gy) {
    const key = `${gx},${gy}`;
    if (this.gameState.unlockedLands.includes(key)) return false;

    const cost = getLandCost(this.gameState.landsPurchased);
    if ((this.gameState.inventory.coin ?? 0) < cost) return false;

    this.gameState.inventory.coin -= cost;
    this.gameState.unlockedLands.push(key);
    this.gameState.landsPurchased++;
    this.events.emit('inventory-changed');

    const ox = gx * LAND_TILE_SIZE;
    const oy = gy * LAND_TILE_SIZE;
    this._fillLandGrass(ox, oy);

    const nodes = getLandNodes(gx, gy);
    for (const n of nodes) {
      this._spawnNode(n.type, n.x, n.y);
    }

    this._updateBuyIcons();
    this.cameras.main.shake(200, 0.01);

    this._showFloatingText(
      ox + LAND_TILE_SIZE / 2, oy + LAND_TILE_SIZE / 2,
      'NEW LAND!', '#44ff44'
    );

    return true;
  }

  // ===== PLAYER =====

  _createPlayer() {
    const px = this.gameState.playerX;
    const py = this.gameState.playerY;
    this.player = this.physics.add.sprite(px, py, 'player_down').setDepth(5);
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(10, 10);
    this.player.body.setOffset(3, 6);
    this.facing = 'down';
    this.isMoving = false;
  }

  // ===== RESOURCE NODES =====

  _spawnLandNodes() {
    for (const landKey of this.gameState.unlockedLands) {
      const [gx, gy] = landKey.split(',').map(Number);
      const nodes = getLandNodes(gx, gy);
      for (const n of nodes) {
        this._spawnNode(n.type, n.x, n.y);
      }
    }
  }

  _spawnNode(type, x, y) {
    const rtype = RESOURCE_TYPES[type];
    if (!rtype || !rtype.nodeTexture) return;

    const node = this.physics.add.staticImage(x, y, rtype.nodeTexture).setDepth(3);
    node.resourceType = rtype;
    node.hp = rtype.hitsToBreak;
    node.maxHp = rtype.hitsToBreak;
    node.depleted = false;
    this.resourceNodes.push(node);
  }

  // ===== DROPS =====

  _setupDropGroup() {
    this.drops = this.physics.add.group();
  }

  _spawnDrop(x, y, resourceId, count) {
    const n = count ?? 1;
    for (let i = 0; i < n; i++) {
      this.time.delayedCall(i * 60, () => this._spawnSingleDrop(x, y, resourceId));
    }
  }

  _spawnSingleDrop(x, y, resourceId) {
    const rtype = RESOURCE_TYPES[resourceId];
    if (!rtype) return;

    const drop = this.physics.add.sprite(x, y, rtype.dropTexture).setDepth(4);
    drop.setData('resourceId', resourceId);
    drop.setData('collectible', false);
    drop.setData('magnetized', false);

    const angle = Math.random() * Math.PI * 2;
    const speed = 60 + Math.random() * 50;
    drop.setVelocity(
      Math.cos(angle) * speed,
      Math.sin(angle) * speed - 100
    );
    drop.setBounce(0.4);
    drop.setDrag(200);

    this.drops.add(drop);

    this.tweens.add({
      targets: drop,
      scaleX: { from: 0, to: 1.3 },
      scaleY: { from: 0, to: 1.3 },
      duration: 150,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.tweens.add({
          targets: drop,
          scaleX: 1, scaleY: 1,
          duration: 100,
        });
      },
    });

    this.time.delayedCall(350, () => {
      if (drop.active) {
        drop.setData('collectible', true);
        drop.setVelocity(0, 0);
        drop.setDrag(0);
        this.tweens.add({
          targets: drop,
          y: drop.y - 3,
          duration: 600,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
      }
    });
  }

  _collectDrop(drop) {
    const resourceId = drop.getData('resourceId');
    if (!resourceId) return;

    drop.setData('collectible', false);

    if (resourceId === 'xp_orb') {
      this.gameState.xp = (this.gameState.xp ?? 0) + 1;
      this._checkLevelUp();
    } else {
      this.gameState.inventory[resourceId] = (this.gameState.inventory[resourceId] ?? 0) + 1;
    }
    this.events.emit('inventory-changed');

    this.tweens.killTweensOf(drop);
    this.tweens.add({
      targets: drop,
      scaleX: 1.5, scaleY: 1.5,
      alpha: 0,
      duration: 150,
      ease: 'Power2',
      onComplete: () => drop.destroy(),
    });
  }

  _magnetizeDrops() {
    const px = this.player.x;
    const py = this.player.y;

    this.drops.getChildren().forEach((drop) => {
      if (!drop.active || !drop.getData('collectible')) return;

      const dist = Phaser.Math.Distance.Between(px, py, drop.x, drop.y);

      if (dist < 16) {
        this._collectDrop(drop);
        return;
      }

      if (dist < MAGNET_RANGE) {
        const angle = Math.atan2(py - drop.y, px - drop.x);
        const speed = MAGNET_SPEED * (1 - dist / MAGNET_RANGE) + 100;
        drop.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
        drop.setData('magnetized', true);
      }
    });
  }

  // ===== AUTO ATTACK =====

  _autoAttack(delta) {
    this.attackCooldown -= delta;
    if (this.attackCooldown > 0) return;
    if (this.craftingOpen) return;

    let closest = null;
    let closestDist = AUTO_ATTACK_RANGE;

    for (const node of this.resourceNodes) {
      if (node.depleted) continue;
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, node.x, node.y);
      if (dist < closestDist) {
        closestDist = dist;
        closest = node;
      }
    }

    if (!closest) return;

    this.attackCooldown = AUTO_ATTACK_CD;
    this._hitNode(closest);
  }

  _hitNode(node) {
    node.hp--;

    this.tweens.add({
      targets: node,
      scaleX: { from: 1.3, to: 1 },
      scaleY: { from: 0.7, to: 1 },
      duration: 120,
      ease: 'Back.easeOut',
    });

    this.tweens.add({
      targets: this.player,
      scaleX: { from: 1.2, to: 1 },
      scaleY: { from: 0.85, to: 1 },
      duration: 100,
      ease: 'Back.easeOut',
    });

    this._spawnHitParticles(node.x, node.y);

    if (node.hp <= 0) {
      this._breakNode(node);
    }
  }

  _breakNode(node) {
    const rtype = node.resourceType;
    node.depleted = true;
    node.setTexture(rtype.nodeTexture + '_depleted');
    node.setAlpha(0.4);

    this.cameras.main.shake(80, 0.006);

    const dropCount = Phaser.Math.Between(rtype.dropMin, rtype.dropMax);
    this._spawnDrop(node.x, node.y, rtype.id, dropCount);

    if (rtype.gatherXP) {
      for (let i = 0; i < rtype.gatherXP; i++) {
        this.time.delayedCall(dropCount * 60 + i * 80, () => {
          this._spawnSingleDrop(node.x, node.y, 'xp_orb');
        });
      }
    }

    this._spawnBreakParticles(node.x, node.y);

    this.time.delayedCall(rtype.respawnTime, () => {
      if (!node.active) return;
      node.depleted = false;
      node.hp = node.maxHp;
      node.setTexture(rtype.nodeTexture);
      node.setAlpha(1);
      this.tweens.add({
        targets: node,
        scaleX: { from: 0, to: 1 },
        scaleY: { from: 0, to: 1 },
        duration: 300,
        ease: 'Back.easeOut',
      });
    });
  }

  _spawnHitParticles(x, y) {
    for (let i = 0; i < 3; i++) {
      const p = this.add.image(x, y, 'particle_hit').setDepth(9).setScale(0.5);
      const angle = Math.random() * Math.PI * 2;
      const dist = 10 + Math.random() * 15;
      this.tweens.add({
        targets: p,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        alpha: 0,
        scaleX: 0,
        scaleY: 0,
        duration: 250 + Math.random() * 100,
        ease: 'Power2',
        onComplete: () => p.destroy(),
      });
    }
  }

  _spawnBreakParticles(x, y) {
    for (let i = 0; i < 6; i++) {
      const p = this.add.image(x, y, 'particle_spark').setDepth(9);
      const angle = (i / 6) * Math.PI * 2;
      const dist = 15 + Math.random() * 20;
      this.tweens.add({
        targets: p,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist - 10,
        alpha: 0,
        scaleX: { from: 1, to: 0 },
        scaleY: { from: 1, to: 0 },
        duration: 350 + Math.random() * 150,
        ease: 'Power3',
        onComplete: () => p.destroy(),
      });
    }
  }

  _showFloatingText(x, y, text, color) {
    const ft = this.add.text(x, y, text, {
      fontSize: '8px', fontFamily: 'monospace', color,
      stroke: '#000000', strokeThickness: 2,
    }).setOrigin(0.5).setDepth(10);

    this.tweens.add({
      targets: ft,
      y: y - 25,
      alpha: { from: 1, to: 0 },
      duration: 800,
      ease: 'Power2',
      onComplete: () => ft.destroy(),
    });
  }

  // ===== INPUT =====

  _setupInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = {
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    this.eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.eKey.on('down', () => this._toggleCrafting());
    this.escKey.on('down', () => this._togglePause());
    this.spaceKey.on('down', () => this._onSpace());
  }

  _onSpace() {
    if (this.craftingOpen) return;

    if (this.nearDesk) {
      this._toggleCrafting();
      return;
    }

    this._tryBuyLand();
  }

  _tryBuyLand() {
    for (const bi of Object.values(this.landBuyIcons)) {
      const cx = bi.gx * LAND_TILE_SIZE + LAND_TILE_SIZE / 2;
      const cy = bi.gy * LAND_TILE_SIZE + LAND_TILE_SIZE / 2;
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, cx, cy);
      if (dist < LAND_TILE_SIZE / 2 + 30) {
        this.buyLand(bi.gx, bi.gy);
        return;
      }
    }
  }

  // ===== CRAFTING =====

  _toggleCrafting() {
    if (!this.nearDesk && !this.craftingOpen) return;
    this.craftingOpen = !this.craftingOpen;
    this.events.emit('crafting-toggled', this.craftingOpen);
  }

  craft(recipeId) {
    const recipe = RECIPES.find(r => r.id === recipeId);
    if (!recipe) return false;

    const inv = this.gameState.inventory;
    for (const [res, amount] of Object.entries(recipe.inputs)) {
      if ((inv[res] ?? 0) < amount) return false;
    }

    for (const [res, amount] of Object.entries(recipe.inputs)) {
      inv[res] -= amount;
    }

    const deskX = 2.5 * LAND_TILE_SIZE + DESK_OFFSET_X;
    const deskY = 2.5 * LAND_TILE_SIZE + DESK_OFFSET_Y;

    if (recipe.output.type === 'coin' && recipe.output.xp) {
      inv.coin = (inv.coin ?? 0) + recipe.output.amount;
      this.gameState.xp = (this.gameState.xp ?? 0) + recipe.output.xp;
      this.gameState.totalCoins = (this.gameState.totalCoins ?? 0) + recipe.output.amount;
      this.gameState.totalProjects = (this.gameState.totalProjects ?? 0) + 1;
      this._checkLevelUp();

      this._spawnDrop(deskX, deskY - 10, 'coin', Math.min(recipe.output.amount, 8));
      this._showFloatingText(deskX, deskY - 30, `+${recipe.output.xp} XP`, '#E8913A');

      this.cameras.main.shake(120, 0.008);
    } else {
      inv[recipe.output.type] = (inv[recipe.output.type] ?? 0) + recipe.output.amount;
    }

    this.events.emit('inventory-changed');
    this._showFloatingText(deskX, deskY - 45, `${recipe.name}!`, '#44cc44');

    this.tweens.add({
      targets: this.desk,
      scaleX: { from: 1.15, to: 1 },
      scaleY: { from: 0.85, to: 1 },
      duration: 150,
      ease: 'Back.easeOut',
    });

    return true;
  }

  _checkLevelUp() {
    const thresholds = [0, 20, 50, 100, 200, 350, 550, 800, 1100, 1500];
    const xp = this.gameState.xp ?? 0;
    let newLevel = 1;
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (xp >= thresholds[i]) {
        newLevel = i + 1;
        break;
      }
    }
    if (newLevel > (this.gameState.level ?? 1)) {
      this.gameState.level = newLevel;
      this.events.emit('level-up', newLevel);
      this._showFloatingText(this.player.x, this.player.y - 20, `LEVEL ${newLevel}!`, '#FFD700');
      this.cameras.main.shake(200, 0.012);
    }
  }

  // ===== PAUSE =====

  _togglePause() {
    if (this.craftingOpen) {
      this.craftingOpen = false;
      this.events.emit('crafting-toggled', false);
      return;
    }
    this.events.emit('pause-toggled');
  }

  // ===== UPDATE =====

  update(_time, delta) {
    this._handleMovement(delta);
    this._autoAttack(delta);
    this._magnetizeDrops();
    this._checkDeskProximity();

    this.saveTimer += delta;
    if (this.saveTimer >= 20000) {
      this.saveTimer = 0;
      this.gameState.playerX = this.player.x;
      this.gameState.playerY = this.player.y;
      SaveSystem.save(this.gameState);
    }
  }

  _handleMovement(delta) {
    if (this.craftingOpen) {
      this.player.setVelocity(0, 0);
      this.isMoving = false;
      return;
    }

    const left = this.cursors.left.isDown || this.wasd.left.isDown;
    const right = this.cursors.right.isDown || this.wasd.right.isDown;
    const up = this.cursors.up.isDown || this.wasd.up.isDown;
    const down = this.cursors.down.isDown || this.wasd.down.isDown;

    let vx = 0;
    let vy = 0;

    if (left) vx = -1;
    else if (right) vx = 1;
    if (up) vy = -1;
    else if (down) vy = 1;

    if (vx !== 0 && vy !== 0) {
      vx *= 0.7071;
      vy *= 0.7071;
    }

    this.player.setVelocity(vx * PLAYER_SPEED, vy * PLAYER_SPEED);
    this.isMoving = vx !== 0 || vy !== 0;

    if (this.isMoving) {
      let newFacing = this.facing;
      if (Math.abs(vx) > Math.abs(vy)) {
        newFacing = vx < 0 ? 'left' : 'right';
      } else {
        newFacing = vy < 0 ? 'up' : 'down';
      }
      if (newFacing !== this.facing) {
        this.facing = newFacing;
        this.player.setTexture(`player_${newFacing}`);
      }

      this.bobTimer += delta;
      const bob = Math.sin(this.bobTimer * 0.012) * 1.5;
      this.player.y += bob * 0.05;
    } else {
      this.bobTimer = 0;
    }
  }

  _checkDeskProximity() {
    if (!this.desk) return;
    const dist = Phaser.Math.Distance.Between(
      this.player.x, this.player.y, this.desk.x, this.desk.y
    );
    const wasNear = this.nearDesk;
    this.nearDesk = dist < 50;

    if (this.nearDesk !== wasNear) {
      this.events.emit('desk-proximity', this.nearDesk);
      if (!this.nearDesk && this.craftingOpen) {
        this.craftingOpen = false;
        this.events.emit('crafting-toggled', false);
      }
    }
  }
}
