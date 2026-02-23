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
    this.energyLabel = this.add.text(370, 8, 'Energy:', style).setDepth(1);
    this.energyBg = this.add.rectangle(445, 15, 100, 12, 0x333333).setOrigin(0, 0.5).setDepth(1);
    this.energyFill = this.add.rectangle(445, 15, 100, 12, 0xF4D03F).setOrigin(0, 0.5).setDepth(2);
    this.energyText = this.add.text(555, 8, '', style).setDepth(1);
    this.moneyText = this.add.text(620, 8, '', style).setDepth(1);
    this.careerText = this.add.text(740, 8, '', { ...style, color: '#D4721A' }).setDepth(1);

    this.emailBadge = this.add.text(935, 8, '', {
      fontSize: '11px', fontFamily: 'monospace', color: '#FFFFFF',
      backgroundColor: '#C0392B', padding: { left: 4, right: 4, top: 1, bottom: 1 },
    }).setDepth(3).setOrigin(1, 0).setVisible(false);

    this.meetingIndicator = this.add.text(935, 24, '', {
      fontSize: '9px', fontFamily: 'monospace', color: '#FFD700',
    }).setDepth(3).setOrigin(1, 0).setVisible(false);

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
    this.dayText.setText(`${ts.getDayOfWeek()} D${gs.day} | ${ts.getSeasonName()} Y${gs.year}`);

    const energy = gs.energy ?? 0;
    const maxEnergy = gs.maxEnergy ?? 10;
    const pct = Math.max(0, energy / maxEnergy);
    this.energyFill.setDisplaySize(100 * pct, 12);
    if (pct <= 0.2) this.energyFill.setFillStyle(0xC0392B);
    else if (pct <= 0.5) this.energyFill.setFillStyle(0xD4721A);
    else this.energyFill.setFillStyle(0xF4D03F);
    this.energyText.setText(`${energy}/${maxEnergy}`);

    this.moneyText.setText(`$${gs.money ?? 0}`);
    this.careerText.setText(this.gameScene.careerSystem?.getTitle() ?? 'Junior Executive');

    const unreadEmails = this.gameScene.emailSystem?.getUnreadCount() ?? 0;
    if (unreadEmails > 0) {
      this.emailBadge.setText(`\u2709 ${unreadEmails}`).setVisible(true);
    } else {
      this.emailBadge.setVisible(false);
    }

    const pendingMeetings = gs.pendingMeetings?.length ?? 0;
    if (pendingMeetings > 0) {
      this.meetingIndicator.setText(`\u25B6 ${pendingMeetings} meeting(s)`).setVisible(true);
    } else {
      this.meetingIndicator.setVisible(false);
    }
  }
}
