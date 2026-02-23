import Phaser from 'phaser';

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.speed = 160;
    this.setCollideWorldBounds(true);
    this.body.setSize(14, 14);
    this.body.setOffset(1, 18);
    this.isInUI = false;
  }

  update(cursors) {
    if (this.isInUI) {
      this.setVelocity(0, 0);
      return;
    }

    let vx = 0, vy = 0;
    if (cursors.left.isDown) vx = -this.speed;
    else if (cursors.right.isDown) vx = this.speed;
    if (cursors.up.isDown) vy = -this.speed;
    else if (cursors.down.isDown) vy = this.speed;

    if (vx !== 0 && vy !== 0) {
      vx *= 0.707;
      vy *= 0.707;
    }

    this.setVelocity(vx, vy);
    if (vx < 0) this.setFlipX(true);
    else if (vx > 0) this.setFlipX(false);
  }

  setInUI(value) {
    this.isInUI = value;
    if (value) this.setVelocity(0, 0);
  }

  getGridPosition() {
    return { x: Math.floor(this.x / 32), y: Math.floor(this.y / 32) };
  }
}
