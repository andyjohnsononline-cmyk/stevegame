import Phaser from 'phaser';
import { Player } from '../entities/Player.js';
import { NPC } from '../entities/NPC.js';
import { TimeSystem } from '../systems/TimeSystem.js';
import { ScriptEngine } from '../systems/ScriptEngine.js';
import { NotesSystem } from '../systems/NotesSystem.js';
import { RelationshipSystem } from '../systems/RelationshipSystem.js';
import { PipelineSystem } from '../systems/PipelineSystem.js';
import { LevelSystem } from '../systems/LevelSystem.js';
import { UpgradeSystem } from '../systems/UpgradeSystem.js';
import { AutomationSystem } from '../systems/AutomationSystem.js';
import { AchievementSystem } from '../systems/AchievementSystem.js';
import { OfflineProgressSystem } from '../systems/OfflineProgressSystem.js';
import { SaveSystem } from '../utils/SaveSystem.js';
import { getLocation } from '../data/locationData.js';
import { getDialogueChoice } from '../data/dialogueChoiceData.js';

const TILE = 32;

const OBJ_TEXTURES = {
  desk: 'obj_desk',
  chair: 'obj_chair',
  table: 'obj_table',
  bookshelf: 'obj_bookshelf',
  door: 'obj_door',
};

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
    this.timePaused = false;
    this.transitioning = false;

    this.timeSystem = new TimeSystem(this);
    this.scriptEngine = new ScriptEngine(this);
    this.notesSystem = new NotesSystem(this);
    this.relationshipSystem = new RelationshipSystem(this);
    this.pipelineSystem = new PipelineSystem(this);
    this.levelSystem = new LevelSystem(this);
    this.upgradeSystem = new UpgradeSystem(this);
    this.automationSystem = new AutomationSystem(this);
    this.achievementSystem = new AchievementSystem(this);
    this.pipelineSystem.migrateScripts();

    this.events.on('day-advanced', () => this._onNewDay());

    if (this.gameState.budget === undefined) this.gameState.budget = 300;

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

    this.backtickKey = this.input.keyboard.addKey(192);

    this.spaceKey.on('down', () => this.handleInteract());
    this.escKey.on('down', () => this.togglePauseMenu());
    this.tabKey.on('down', () => this.openInbox());
    this.backtickKey.on('down', () => this.toggleDebug());

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

    if (this.loadSave) {
      const offlineResult = OfflineProgressSystem.calculate(
        this.gameState, this.pipelineSystem, this.scriptEngine, this.levelSystem
      );
      if (offlineResult.daysElapsed > 0 || offlineResult.scriptsReleased > 0) {
        this.achievementSystem.checkAll();
        this.timePaused = true;
        this.player?.setInUI(true);
        this.scene.launch('DialogueScene', {
          gameScene: this,
          mode: 'welcome_back',
          offlineResult,
        });
      }
    }
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

    for (let row = 0; row < loc.mapHeight; row++) {
      for (let col = 0; col < loc.mapWidth; col++) {
        const px = col * TILE + TILE / 2;
        const py = row * TILE + TILE / 2;
        const isWall = loc.wallMap?.[row]?.[col] === 1;

        const texKey = isWall ? wallKey : floorKey;
        const fallback = this.textures.exists(texKey) ? texKey : 'tile_office_floor';
        this.add.image(px, py, fallback).setDepth(0);

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
    this.showLocationBanner(loc.name);
  }

  cleanupLocation() {
    this.npcs.forEach(n => n.destroy());
    this.npcs = [];
    this.interactables = [];
    this.exitZones = [];
    this.children?.list
      ?.filter(c => c !== this.interactPrompt && c !== this.locationBanner && c !== this.messageText)
      .forEach(c => c.destroy());
  }

  spawnNPCs() {
    this.npcs.forEach(n => n.destroy());
    this.npcs = [];

    const npcsHere = this.relationshipSystem.getNPCsAtLocation(this.gameState.currentLocation);
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
    if (this.timePaused || this.transitioning || !this.player || this.player.isInUI) return;

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

  handleExit(exit) {
    if (this.transitioning) return;
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
    SaveSystem.save(this.gameState);
    this.cameras.main.fadeOut(200, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.loadLocation(exit.target);
      this.cameras.main.fadeIn(200, 0, 0, 0);
      this.transitioning = false;
    });
  }

  startDialogue(npc) {
    const charData = npc.getCharacterData();
    const hearts = this.relationshipSystem.getHearts(npc.characterId);

    const choice = getDialogueChoice(npc.characterId, hearts);

    this.timePaused = true;
    this.player.setInUI(true);

    if (choice) {
      this.scene.launch('DialogueScene', {
        gameScene: this,
        mode: 'dialogue_choice',
        speakerName: charData.name,
        characterId: npc.characterId,
        choiceData: choice,
      });
    } else {
      const dialogue = npc.getDialogue(hearts);
      if (!dialogue) { this.resumeFromUI(); return; }
      this.relationshipSystem.addHearts(npc.characterId, 0.1);
      this.scene.launch('DialogueScene', {
        gameScene: this,
        mode: 'dialogue',
        speakerName: charData.name,
        text: dialogue,
        characterId: npc.characterId,
      });
    }
  }

  handleObjectInteraction(obj) {
    switch (obj.action) {
      case 'read_scripts':
      case 'work': this.openDeskMenu(); break;
      case 'sit': this.showMessage(this._flavorText('sit')); break;
      case 'browse': this.showMessage(this._flavorText('browse')); break;
      default: this.showMessage(obj.label ?? 'Nothing happens.');
    }
  }

  openDeskMenu() {
    if (this.scene.isActive('DialogueScene')) return;
    this.timePaused = true;
    this.player?.setInUI(true);
    this.scene.launch('DialogueScene', {
      gameScene: this,
      mode: 'desk_menu',
    });
  }

  openInbox() {
    if (this.scene.isActive('DialogueScene')) return;
    this.timePaused = true;
    this.player?.setInUI(true);
    this.scene.launch('DialogueScene', {
      gameScene: this,
      mode: 'inbox',
    });
  }

  toggleDebug() {
    if (this.scene.isActive('DebugScene')) {
      this.scene.stop('DebugScene');
      if (!this.scene.isActive('DialogueScene')) {
        this.resumeFromUI();
      }
    } else {
      this.player?.setInUI(true);
      this.scene.launch('DebugScene', { gameScene: this });
    }
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
    this.scriptEngine.populateInbox(Math.random() < 0.6 ? 1 : 2);
    this.automationSystem.onNewDay();
    this.spawnNPCs();
    SaveSystem.save(this.gameState);
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
      browse: [
        'Interesting reads on the shelf.',
        'You browse but nothing catches your eye.',
        'A well-worn copy of "Story" by Robert McKee.',
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
    this.timeSystem.update(delta);

    const speed = this.gameState.speedMultiplier ?? 1;
    const gameMinutes = (delta / 1000) * 20 * speed;
    this.pipelineSystem.update(gameMinutes);

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

    this.updateInteractionPrompt();
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
