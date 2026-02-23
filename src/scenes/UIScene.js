import Phaser from 'phaser';

export class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene' });
  }

  init(data) {
    this.gameScene = data.gameScene;
  }

  create() {
    this.hudBg = this.add.rectangle(480, 0, 960, 36, 0x000000, 0.75)
      .setOrigin(0.5, 0).setDepth(0);

    const style = { fontSize: '13px', fontFamily: 'monospace', color: '#F5E6CC' };

    this.clockText = this.add.text(16, 8, '', style).setDepth(1);
    this.dayText = this.add.text(140, 8, '', style).setDepth(1);

    this.controlsText = this.add.text(480, 625, 'ARROWS/WASD: Move | SPACE: Interact | TAB: Inbox | ESC: Menu', {
      fontSize: '10px', fontFamily: 'monospace', color: '#666688',
    }).setOrigin(0.5).setDepth(1);

    this.messageText = this.add.text(480, 590, '', {
      fontSize: '14px', fontFamily: 'monospace', color: '#F5E6CC',
      backgroundColor: '#000000BB', padding: { left: 10, right: 10, top: 4, bottom: 4 },
    }).setOrigin(0.5).setDepth(10).setAlpha(0);

    this.gameScene.events.on('show-message', (text) => this.showNotification(text));
  }

  showNotification(text, color = '#F5E6CC') {
    this.messageText.setText(text).setStyle({ color }).setAlpha(1);
    this.tweens.killTweensOf(this.messageText);
    this.tweens.add({
      targets: this.messageText,
      alpha: 0, duration: 1500, delay: 2500,
      onComplete: () => this.messageText.setAlpha(0),
    });
  }

  update() {
    const gs = this.gameScene?.gameState;
    const ts = this.gameScene?.timeSystem;
    if (!gs || !ts) return;

    this.clockText.setText(ts.getTimeString());
    this.dayText.setText(`Day ${gs.day}`);
  }
}
