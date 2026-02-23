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

    this.walkTimer = 0;
    this.walkFrame = 0;
    this.wasMoving = false;
    this.walkFrameKeys = ['player', 'player_walk_1', 'player', 'player_walk_2'];
  }

  update(cursors) {
    if (this.isInUI) {
      this.setVelocity(0, 0);
      if (this.wasMoving) {
        this.setTexture('player');
        this.wasMoving = false;
      }
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

    const isMoving = vx !== 0 || vy !== 0;
    if (isMoving) {
      this.walkTimer += this.scene.game.loop.delta;
      if (this.walkTimer >= 150) {
        this.walkTimer = 0;
        this.walkFrame = (this.walkFrame + 1) % this.walkFrameKeys.length;
        const frameKey = this.walkFrameKeys[this.walkFrame];
        if (this.scene.textures.exists(frameKey)) {
          this.setTexture(frameKey);
        }
      }
      this.wasMoving = true;
    } else if (this.wasMoving) {
      this.setTexture('player');
      this.walkFrame = 0;
      this.walkTimer = 0;
      this.wasMoving = false;
    }
  }

  setInUI(value) {
    this.isInUI = value;
    if (value) {
      this.setVelocity(0, 0);
      this.setTexture('player');
      this.walkFrame = 0;
      this.walkTimer = 0;
      this.wasMoving = false;
    }
  }

  getGridPosition() {
    return { x: Math.floor(this.x / 32), y: Math.floor(this.y / 32) };
  }
}
