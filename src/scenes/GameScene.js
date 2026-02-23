import Phaser from 'phaser';
import { Player } from '../entities/Player.js';
import { NPC } from '../entities/NPC.js';
import { TimeSystem } from '../systems/TimeSystem.js';
import { EnergySystem } from '../systems/EnergySystem.js';
import { ScriptEngine } from '../systems/ScriptEngine.js';
import { NotesSystem } from '../systems/NotesSystem.js';
import { RelationshipSystem } from '../systems/RelationshipSystem.js';
import { CareerSystem } from '../systems/CareerSystem.js';
import { PipelineSystem } from '../systems/PipelineSystem.js';
import { EventSystem } from '../systems/EventSystem.js';
import { SaveSystem } from '../utils/SaveSystem.js';
import { LOCATIONS, getLocation } from '../data/locationData.js';
import { CHARACTERS } from '../data/characterData.js';
import { PALETTE } from '../utils/TextureGenerator.js';

const TILE = 32;

const OBJ_TEXTURES = {
  bed: 'obj_bed',
  desk: 'obj_desk',
  coffee_machine: 'obj_coffee',
  phone: 'obj_phone',
  chair: 'obj_chair',
  table: 'obj_table',
  bookshelf: 'obj_bookshelf',
  bar: 'obj_table',
  bench: 'obj_bench',
  tree: 'obj_tree',
  reception: 'obj_desk',
  meeting: 'obj_desk',
  gift_vendor: 'obj_market_stall',
  stall: 'obj_market_stall',
  door: 'obj_door',
  smoking_area: 'obj_smoking_area',
};

const MAP_CONNECTIONS = [
  ['houseboat', 'cafe'],
  ['cafe', 'canal_walk'],
  ['canal_walk', 'office_ground'],
  ['canal_walk', 'market'],
  ['office_ground', 'office_upper'],
];

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

    this.npcs = [];
    this.interactables = [];
    this.exitZones = [];
    this.waterTiles = [];
    this.timePaused = false;
    this.transitioning = false;
    this.travelMapOpen = false;
    this.travelMapElements = [];
    this.waterFrame = 0;
    this.waterTimer = 0;
    this.rainEmitter = null;

    this.timeSystem = new TimeSystem(this);
    this.energySystem = new EnergySystem(this);
    this.scriptEngine = new ScriptEngine(this);
    this.notesSystem = new NotesSystem(this);
    this.relationshipSystem = new RelationshipSystem(this);
    this.careerSystem = new CareerSystem(this);
    this.pipelineSystem = new PipelineSystem(this);
    this.eventSystem = new EventSystem();

    if (!this.gameState.inbox) this.gameState.inbox = [];
    if (this.gameState.inbox.length === 0) {
      this.scriptEngine.populateInbox(3);
    }

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = {
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.tabKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);

    this.spaceKey.on('down', () => this.handleInteract());
    this.escKey.on('down', () => this.handleEsc());
    this.tabKey.on('down', () => this.openInbox());

    this.daylightOverlay = this.add.rectangle(480, 320, 1600, 1200, 0x0a0a1e)
      .setDepth(50).setAlpha(0).setScrollFactor(0);

    this.interactPrompt = this.add.text(0, 0, '', {
      fontSize: '11px', fontFamily: 'monospace', color: '#FFD700',
      backgroundColor: '#000000AA', padding: { left: 6, right: 6, top: 3, bottom: 3 },
    }).setDepth(200).setVisible(false);

    this.locationBanner = this.add.text(480, 40, '', {
      fontSize: '20px', fontFamily: 'Georgia, serif', color: '#F5E6CC',
      stroke: '#000', strokeThickness: 4,
    }).setOrigin(0.5).setDepth(200).setAlpha(0).setScrollFactor(0);

    this.messageText = this.add.text(480, 580, '', {
      fontSize: '13px', fontFamily: 'monospace', color: '#F5E6CC',
      backgroundColor: '#000000CC',
      padding: { left: 12, right: 12, top: 6, bottom: 6 },
    }).setOrigin(0.5).setDepth(200).setAlpha(0).setScrollFactor(0);

    this.loadLocation(this.gameState.currentLocation ?? 'houseboat');
    this.scene.launch('UIScene', { gameScene: this });
  }

  loadLocation(locationId) {
    const loc = getLocation(locationId);
    if (!loc) return;

    this.cleanupLocation();
    this.gameState.currentLocation = locationId;
    this.currentLocation = loc;

    const mapW = loc.mapWidth * TILE;
    const mapH = loc.mapHeight * TILE;
    this.physics.world.setBounds(0, 0, mapW, mapH);
    this.cameras.main.setBounds(0, 0, mapW, mapH);

    this.wallGroup = this.physics.add.staticGroup();

    const floorKey = loc.tileFloor ?? 'tile_office_floor';
    const wallKey = loc.tileWall ?? 'tile_wall';
    const isWaterWall = wallKey === 'tile_water';

    for (let row = 0; row < loc.mapHeight; row++) {
      for (let col = 0; col < loc.mapWidth; col++) {
        const px = col * TILE + TILE / 2;
        const py = row * TILE + TILE / 2;
        const isWall = loc.wallMap?.[row]?.[col] === 1;

        let texKey = isWall ? wallKey : floorKey;
        if (isWall && isWaterWall) texKey = 'tile_water_0';
        const fallback = this.textures.exists(texKey) ? texKey : 'tile_office_floor';
        const tileImg = this.add.image(px, py, fallback).setDepth(0);

        if (isWall && isWaterWall) {
          this.waterTiles.push(tileImg);
        }

        if (isWall) {
          const wall = this.wallGroup.create(px, py, null);
          wall.setVisible(false);
          wall.body.setSize(TILE, TILE);
          wall.refreshBody();
        }
      }
    }

    this.interactables = [];
    for (const obj of (loc.interactables ?? [])) {
      const px = obj.x * TILE + TILE / 2;
      const py = obj.y * TILE + TILE / 2;
      const texKey = OBJ_TEXTURES[obj.type] ?? 'obj_desk';
      const fallback = this.textures.exists(texKey) ? texKey : 'obj_desk';
      this.add.image(px, py, fallback).setDepth(2);
      this.interactables.push({ ...obj, px, py });
    }

    this.exitZones = [];
    for (const exit of (loc.exits ?? [])) {
      const px = exit.x * TILE + TILE / 2;
      const py = exit.y * TILE + TILE / 2;
      if (this.textures.exists('obj_door')) {
        this.add.image(px, py, 'obj_door').setDepth(2);
      }
      this.add.text(px, py - 20, exit.label, {
        fontSize: '9px', fontFamily: 'monospace', color: '#FFD700',
        stroke: '#000', strokeThickness: 2,
      }).setOrigin(0.5).setDepth(6);
      this.exitZones.push({ ...exit, px, py });
    }

    const spawn = this.gameState.playerPos ?? { x: Math.floor(loc.mapWidth / 2), y: Math.floor(loc.mapHeight / 2) };
    if (this.player) this.player.destroy();
    this.player = new Player(this, spawn.x * TILE + TILE / 2, spawn.y * TILE + TILE / 2);
    this.player.setDepth(10);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.physics.add.collider(this.player, this.wallGroup);

    this.spawnNPCs();
    this.setupRain(loc);
    this.showLocationBanner(loc.name);
  }

  cleanupLocation() {
    this.npcs.forEach(n => n.destroy());
    this.npcs = [];
    this.interactables = [];
    this.exitZones = [];
    this.waterTiles = [];
    if (this.rainEmitter) {
      this.rainEmitter.stop();
      this.rainEmitter = null;
    }
    this.children?.list
      ?.filter(c => c !== this.daylightOverlay && c !== this.interactPrompt
        && c !== this.locationBanner && c !== this.messageText)
      .forEach(c => c.destroy());
  }

  spawnNPCs() {
    this.npcs.forEach(n => n.destroy());
    this.npcs = [];

    const timePeriod = this.timeSystem.getTimePeriod();
    const npcsHere = this.relationshipSystem.getNPCsAtLocation(this.gameState.currentLocation, timePeriod);
    const spots = this.currentLocation?.npcSpots ?? [];

    npcsHere.forEach((charData, i) => {
      if (i >= spots.length) return;
      const spot = spots[i];
      const px = spot.x * TILE + TILE / 2;
      const py = spot.y * TILE + TILE / 2;
      try {
        const npc = new NPC(this, px, py, charData.id);
        this.npcs.push(npc);
        if (this.player) this.physics.add.collider(this.player, npc);
      } catch (e) {
        console.warn('Failed to spawn NPC:', charData.name, e);
      }
    });
  }

  setupRain(loc) {
    if (!loc.outdoors || !this.textures.exists('particle_rain')) return;
    if (Math.random() > 0.4) return;

    const mapW = loc.mapWidth * TILE;
    const mapH = loc.mapHeight * TILE;
    this.rainEmitter = this.add.particles(0, -20, 'particle_rain', {
      x: { min: 0, max: mapW },
      y: -10,
      lifespan: 800,
      speedY: { min: 200, max: 350 },
      speedX: { min: -30, max: -10 },
      scale: { start: 0.8, end: 0.3 },
      alpha: { start: 0.6, end: 0.1 },
      quantity: 3,
      frequency: 40,
    });
    this.rainEmitter.setDepth(45);
  }

  showLocationBanner(name) {
    this.locationBanner.setText(name).setAlpha(1);
    this.tweens.add({
      targets: this.locationBanner,
      alpha: 0, duration: 2000, delay: 1200, ease: 'Power2',
    });
  }

  showMessage(text) {
    this.messageText.setText(text).setAlpha(1);
    this.tweens.killTweensOf(this.messageText);
    this.tweens.add({
      targets: this.messageText,
      alpha: 0, duration: 1500, delay: 2000, ease: 'Power2',
    });
  }

  handleInteract() {
    if (this.travelMapOpen || this.timePaused || this.transitioning || !this.player || this.player.isInUI) return;

    const px = this.player.x;
    const py = this.player.y;

    for (const exit of this.exitZones) {
      if (Phaser.Math.Distance.Between(px, py, exit.px, exit.py) < 44) {
        this.handleExit(exit);
        return;
      }
    }

    for (const npc of this.npcs) {
      if (Phaser.Math.Distance.Between(px, py, npc.x, npc.y) < 48) {
        this.startDialogue(npc);
        return;
      }
    }

    for (const obj of this.interactables) {
      if (Phaser.Math.Distance.Between(px, py, obj.px, obj.py) < 44) {
        this.handleObjectInteraction(obj);
        return;
      }
    }
  }

  handleEsc() {
    if (this.travelMapOpen) {
      this.closeTravelMap();
      return;
    }
    this.togglePauseMenu();
  }

  handleExit(exit) {
    if (this.transitioning) return;

    if (exit.outdoorExit) {
      this.showTravelMap();
      return;
    }

    this.transitioning = true;
    const targetLoc = getLocation(exit.target);
    if (!targetLoc) { this.transitioning = false; return; }

    const returnExit = targetLoc.exits?.find(e => e.target === this.gameState.currentLocation);
    let spawnPos;
    if (returnExit) {
      const offX = returnExit.x <= 0 ? 2 : returnExit.x >= targetLoc.mapWidth - 1 ? -2 : 0;
      const offY = returnExit.y <= 0 ? 2 : returnExit.y >= targetLoc.mapHeight - 1 ? -2 : 0;
      spawnPos = { x: returnExit.x + (offX || 0), y: returnExit.y + (offY || 1) };
    } else {
      spawnPos = { x: Math.floor(targetLoc.mapWidth / 2), y: Math.floor(targetLoc.mapHeight / 2) };
    }

    this.gameState.playerPos = spawnPos;
    this.cameras.main.fadeOut(200, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.loadLocation(exit.target);
      this.cameras.main.fadeIn(200, 0, 0, 0);
      this.transitioning = false;
    });
  }

  // ========== TRAVEL MAP ==========

  showTravelMap() {
    if (this.travelMapOpen) return;
    this.travelMapOpen = true;
    this.timePaused = true;
    this.player?.setInUI(true);
    this.travelMapElements = [];

    const cam = this.cameras.main;
    const cx = cam.scrollX + cam.width / 2;
    const cy = cam.scrollY + cam.height / 2;

    const bg = this.add.rectangle(cx, cy, cam.width, cam.height, 0x1A1A2E, 0.92)
      .setDepth(300).setScrollFactor(0).setOrigin(0.5);
    this.travelMapElements.push(bg);

    const mapBg = this.add.rectangle(480, 310, 700, 480, 0x3A5A8A, 1)
      .setDepth(301).setScrollFactor(0).setOrigin(0.5);
    this.travelMapElements.push(mapBg);

    const mapInner = this.add.rectangle(480, 310, 690, 470, 0x5B9BD5, 1)
      .setDepth(302).setScrollFactor(0).setOrigin(0.5);
    this.travelMapElements.push(mapInner);

    const landAreas = [
      { x: 260, y: 180, w: 200, h: 120 },
      { x: 380, y: 250, w: 280, h: 150 },
      { x: 520, y: 160, w: 160, h: 100 },
      { x: 580, y: 340, w: 200, h: 160 },
    ];
    for (const la of landAreas) {
      const land = this.add.rectangle(la.x, la.y, la.w, la.h, 0xD5C4A1, 1)
        .setDepth(303).setScrollFactor(0);
      this.travelMapElements.push(land);
    }

    const canalPaths = [
      { x1: 300, y1: 220, x2: 450, y2: 280 },
      { x1: 450, y1: 280, x2: 550, y2: 200 },
      { x1: 450, y1: 280, x2: 600, y2: 380 },
    ];
    for (const cp of canalPaths) {
      const line = this.add.graphics().setDepth(304).setScrollFactor(0);
      line.lineStyle(4, 0x4A8AC0, 0.6);
      line.beginPath();
      line.moveTo(cp.x1, cp.y1);
      line.lineTo(cp.x2, cp.y2);
      line.strokePath();
      this.travelMapElements.push(line);
    }

    const title = this.add.text(480, 85, 'Amsterdam', {
      fontSize: '24px', fontFamily: 'Georgia, serif', color: '#F5E6CC',
      stroke: '#000', strokeThickness: 3,
    }).setOrigin(0.5).setDepth(310).setScrollFactor(0);
    this.travelMapElements.push(title);

    const subtitle = this.add.text(480, 110, 'Where would you like to go?', {
      fontSize: '12px', fontFamily: 'Georgia, serif', color: '#CCBBAA',
    }).setOrigin(0.5).setDepth(310).setScrollFactor(0);
    this.travelMapElements.push(subtitle);

    for (const conn of MAP_CONNECTIONS) {
      const locA = LOCATIONS[conn[0]];
      const locB = LOCATIONS[conn[1]];
      if (!locA?.mapPosition || !locB?.mapPosition) continue;
      const pathLine = this.add.graphics().setDepth(305).setScrollFactor(0);
      pathLine.lineStyle(2, 0xB0A080, 0.5);
      pathLine.beginPath();
      pathLine.moveTo(locA.mapPosition.x, locA.mapPosition.y);
      pathLine.lineTo(locB.mapPosition.x, locB.mapPosition.y);
      pathLine.strokePath();
      this.travelMapElements.push(pathLine);
    }

    const currentLocId = this.gameState.currentLocation;

    for (const [locId, loc] of Object.entries(LOCATIONS)) {
      if (!loc.mapPosition) continue;
      const { x, y } = loc.mapPosition;
      const isCurrent = locId === currentLocId;

      const nodeKey = isCurrent ? 'map_node_current' : 'map_node';
      const nodeFallback = this.textures.exists(nodeKey) ? nodeKey : 'map_node';
      const node = this.add.image(x, y, nodeFallback)
        .setDepth(306).setScrollFactor(0).setInteractive({ useHandCursor: true });
      this.travelMapElements.push(node);

      const label = this.add.text(x, y + 16, loc.name, {
        fontSize: '10px', fontFamily: 'Georgia, serif', color: '#F5E6CC',
        stroke: '#000', strokeThickness: 2,
      }).setOrigin(0.5).setDepth(310).setScrollFactor(0);
      this.travelMapElements.push(label);

      if (!isCurrent) {
        node.on('pointerover', () => {
          node.setScale(1.3);
          label.setStyle({ color: '#FFD700' });
        });
        node.on('pointerout', () => {
          node.setScale(1);
          label.setStyle({ color: '#F5E6CC' });
        });
        node.on('pointerdown', () => this.travelTo(locId));
      }
    }

    const hint = this.add.text(480, 555, '[ESC] Cancel', {
      fontSize: '11px', fontFamily: 'monospace', color: '#888',
    }).setOrigin(0.5).setDepth(310).setScrollFactor(0);
    this.travelMapElements.push(hint);
  }

  closeTravelMap() {
    for (const el of this.travelMapElements) {
      el.destroy();
    }
    this.travelMapElements = [];
    this.travelMapOpen = false;
    this.timePaused = false;
    this.player?.setInUI(false);
  }

  travelTo(locationId) {
    if (this.transitioning) return;
    this.transitioning = true;

    const targetLoc = getLocation(locationId);
    if (!targetLoc) { this.transitioning = false; return; }

    const currentPos = LOCATIONS[this.gameState.currentLocation]?.mapPosition;
    const targetPos = targetLoc.mapPosition;
    let travelTime = 10;
    if (currentPos && targetPos) {
      const dist = Math.sqrt((targetPos.x - currentPos.x) ** 2 + (targetPos.y - currentPos.y) ** 2);
      travelTime = Math.round(5 + (dist / 50) * 5);
      travelTime = Math.min(travelTime, 15);
    }

    this.gameState.time = (this.gameState.time ?? 480) + travelTime;

    const spawnPos = { x: Math.floor(targetLoc.mapWidth / 2), y: Math.floor(targetLoc.mapHeight / 2) };
    const returnExit = targetLoc.exits?.find(e => e.target === this.gameState.currentLocation);
    if (returnExit) {
      const offX = returnExit.x <= 0 ? 2 : returnExit.x >= targetLoc.mapWidth - 1 ? -2 : 0;
      const offY = returnExit.y <= 0 ? 2 : returnExit.y >= targetLoc.mapHeight - 1 ? -2 : 0;
      spawnPos.x = returnExit.x + (offX || 0);
      spawnPos.y = returnExit.y + (offY || 1);
    }

    this.gameState.playerPos = spawnPos;

    this.closeTravelMap();
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.loadLocation(locationId);
      this.cameras.main.fadeIn(300, 0, 0, 0);
      this.transitioning = false;
    });
  }

  // ========== DIALOGUE & INTERACTIONS ==========

  startDialogue(npc) {
    const hearts = this.relationshipSystem.getHearts(npc.characterId);
    const dialogue = npc.getDialogue(hearts);
    if (!dialogue) return;

    this.relationshipSystem.addHearts(npc.characterId, 0.2);
    this.timePaused = true;
    this.player.setInUI(true);

    this.scene.launch('DialogueScene', {
      gameScene: this,
      mode: 'dialogue',
      speakerName: npc.getCharacterData().name,
      text: dialogue,
      characterId: npc.characterId,
    });
  }

  handleObjectInteraction(obj) {
    switch (obj.action) {
      case 'sleep': this.handleSleep(); break;
      case 'make_coffee': this.handleCoffee(); break;
      case 'check_phone':
      case 'read_scripts':
      case 'work': this.openInbox(); break;
      case 'buy_gift': this.openGiftShop(); break;
      case 'order_drink': this.handleDrink(); break;
      case 'sit': this.showMessage(this._flavorText('sit')); break;
      case 'admire': this.showMessage(this._flavorText('admire')); break;
      case 'browse': this.showMessage(this._flavorText('browse')); break;
      case 'smoke': this.handleSmoke(); break;
      default: this.showMessage(obj.label ?? 'Nothing happens.');
    }
  }

  handleSleep() {
    const h = Math.floor((this.gameState.time ?? 480) / 60);
    if (h < 18) {
      this.showMessage("It's too early to sleep. Enjoy the day first.");
      return;
    }
    this.showMessage('Sleeping... Sweet dreams, Steve.');
    SaveSystem.save(this.gameState);

    this.time.delayedCall(1200, () => {
      this.timeSystem.advanceDay();
      this.energySystem.restoreFull();
      this._onNewDay();
    });
  }

  handleCoffee() {
    if ((this.gameState.energy ?? 0) >= (this.gameState.maxEnergy ?? 10)) {
      this.showMessage('Already at full energy!');
      return;
    }
    this.energySystem.restore(2);
    this.gameState.time = (this.gameState.time ?? 480) + 15;
    this.showMessage('A strong Dutch coffee. +2 Energy.');
  }

  handleDrink() {
    if (!this.energySystem.canAfford('socialize')) {
      this.showMessage('Too tired for a drink.');
      return;
    }
    this.energySystem.spend('socialize');
    this.gameState.time = (this.gameState.time ?? 480) + 30;
    this.showMessage('You enjoy a borrel at the bar. Gezellig.');
  }

  handleSmoke() {
    this.gameState.time = (this.gameState.time ?? 480) + 15;
    this.energySystem.restore(1);
    const lines = [
      'You light up by the canal. The water glimmers. +1 Energy.',
      'A quiet smoke break. Barges drift by. +1 Energy.',
      'You watch the cyclists pass, cigarette in hand. +1 Energy.',
      'The canal air mixes with smoke. A moment of calm. +1 Energy.',
    ];
    this.showMessage(lines[Math.floor(Math.random() * lines.length)]);
  }

  openInbox() {
    if (this.travelMapOpen) return;
    if (this.scene.isActive('DialogueScene')) return;
    this.timePaused = true;
    this.player?.setInUI(true);
    this.scene.launch('DialogueScene', {
      gameScene: this,
      mode: 'inbox',
    });
  }

  openGiftShop() {
    this.timePaused = true;
    this.player?.setInUI(true);
    this.scene.launch('DialogueScene', {
      gameScene: this,
      mode: 'gift_shop',
    });
  }

  togglePauseMenu() {
    if (this.scene.isActive('DialogueScene')) {
      this.scene.stop('DialogueScene');
      this.resumeFromUI();
      return;
    }
    this.timePaused = true;
    this.player?.setInUI(true);
    this.scene.launch('DialogueScene', {
      gameScene: this,
      mode: 'pause',
    });
  }

  _onNewDay() {
    const gs = this.gameState;

    const pipelineMessages = this.pipelineSystem.processDailyPipeline();
    pipelineMessages.forEach((msg, i) => {
      this.time.delayedCall(500 + i * 1500, () => this.showMessage(msg));
    });

    if (gs.day % 7 === 0) {
      this.careerSystem.paySalary();
      const salary = this.careerSystem.getSalary();
      this.showMessage(`Payday! +$${salary}`);
    }

    const promoted = this.careerSystem.checkPromotion();
    if (promoted) {
      this.time.delayedCall(1500, () => {
        this.showMessage(`Promoted to ${this.careerSystem.getTitle()}!`);
      });
    }

    this.scriptEngine.populateInbox(Math.random() < 0.6 ? 1 : 2);

    const event = this.eventSystem.checkForEvent(gs);
    if (event) {
      this.time.delayedCall(2000, () => {
        this.timePaused = true;
        this.player?.setInUI(true);
        this.scene.launch('DialogueScene', {
          gameScene: this,
          mode: 'event',
          event,
        });
      });
    }

    this.spawnNPCs();
  }

  resumeFromUI() {
    this.timePaused = false;
    this.player?.setInUI(false);
  }

  _flavorText(action) {
    const pool = {
      sit: [
        'You take a seat and enjoy a quiet moment.',
        'The chair creaks. Amsterdam hums outside.',
        'A moment of calm in the chaos.',
      ],
      admire: [
        'The Amsterdam light is beautiful today.',
        'Trees sway over the canal. A cyclist passes.',
        'The city has a way of making you feel small and grateful.',
      ],
      browse: [
        'Interesting wares.',
        'You browse but nothing catches your eye.',
        'The vendor smiles warmly.',
      ],
    };
    const lines = pool[action] ?? ['You look around.'];
    return lines[Math.floor(Math.random() * lines.length)];
  }

  getCoverageRating(script) {
    const q = script.quality ?? {};
    const avg = Object.values(q).reduce((a, b) => a + b, 0) / Math.max(Object.values(q).length, 1);
    if (avg >= 7) return 'Recommend';
    if (avg >= 4) return 'Consider';
    return 'Pass';
  }

  update(time, delta) {
    if (!this.timePaused) {
      this.timeSystem.update(delta);

      if ((this.gameState.time ?? 480) >= 1380) {
        this.showMessage("It's getting very late. Head home to sleep.");
      }
    }

    if (this.player && !this.player.isInUI) {
      const combined = {
        left: { isDown: this.cursors.left.isDown || this.wasd.left.isDown },
        right: { isDown: this.cursors.right.isDown || this.wasd.right.isDown },
        up: { isDown: this.cursors.up.isDown || this.wasd.up.isDown },
        down: { isDown: this.cursors.down.isDown || this.wasd.down.isDown },
      };
      this.player.update(combined);
    }

    for (const npc of this.npcs) {
      npc.update(this.player?.x ?? 0, this.player?.y ?? 0);
    }

    this.updateDaylight();
    this.updateWaterAnimation(delta);

    if (!this.travelMapOpen) {
      this.updateInteractionPrompt();
    }
  }

  updateDaylight() {
    if (!this.daylightOverlay) return;
    const hour = (this.gameState.time ?? 480) / 60;

    if (hour >= 18 && hour < 20) {
      const t = (hour - 18) / 2;
      const r = Math.round(0x0a + t * (0xFF - 0x0a) * 0.3);
      const gg = Math.round(0x0a + t * (0x70 - 0x0a) * 0.3);
      const b = Math.round(0x1e + t * (0x43 - 0x1e) * 0.2);
      this.daylightOverlay.fillColor = (r << 16) | (gg << 8) | b;
      this.daylightOverlay.setAlpha(t * 0.25);
    } else if (hour >= 20) {
      this.daylightOverlay.fillColor = 0x0a0a1e;
      const t = Math.min((hour - 20) / 3, 1);
      this.daylightOverlay.setAlpha(0.15 + t * 0.35);
    } else {
      this.daylightOverlay.setAlpha(0);
    }
  }

  updateWaterAnimation(delta) {
    if (this.waterTiles.length === 0) return;
    this.waterTimer += delta;
    if (this.waterTimer < 500) return;
    this.waterTimer = 0;
    this.waterFrame = (this.waterFrame + 1) % 4;
    const texKey = `tile_water_${this.waterFrame}`;
    if (!this.textures.exists(texKey)) return;
    for (const tile of this.waterTiles) {
      tile.setTexture(texKey);
    }
  }

  updateInteractionPrompt() {
    if (!this.player || this.player.isInUI) {
      this.interactPrompt?.setVisible(false);
      return;
    }

    const px = this.player.x;
    const py = this.player.y;
    let closest = { dist: 48, text: '', x: 0, y: 0 };

    for (const exit of this.exitZones) {
      const d = Phaser.Math.Distance.Between(px, py, exit.px, exit.py);
      if (d < closest.dist) closest = { dist: d, text: `[SPACE] ${exit.label}`, x: exit.px, y: exit.py - 28 };
    }
    for (const obj of this.interactables) {
      const d = Phaser.Math.Distance.Between(px, py, obj.px, obj.py);
      if (d < closest.dist) closest = { dist: d, text: `[SPACE] ${obj.label}`, x: obj.px, y: obj.py - 28 };
    }
    for (const npc of this.npcs) {
      const d = Phaser.Math.Distance.Between(px, py, npc.x, npc.y);
      if (d < closest.dist) closest = { dist: d, text: '[SPACE] Talk', x: npc.x, y: npc.y - 40 };
    }

    if (closest.text) {
      this.interactPrompt.setText(closest.text).setPosition(closest.x, closest.y).setOrigin(0.5).setVisible(true);
    } else {
      this.interactPrompt.setVisible(false);
    }
  }
}
