export class TimeSystem {
  constructor(scene) {
    this.scene = scene;
  }

  get state() {
    return this.scene.gameState;
  }

  update(delta) {
    if (!this.state) return;
    const gameMinutes = (delta / 1000) * 10;
    this.state.time = (this.state.time ?? 480) + gameMinutes;

    if (this.state.time >= 1440) {
      this.advanceDay();
    }

    this.scene.events?.emit('hud-update');
  }

  getTimeString() {
    const totalMinutes = Math.floor(this.state?.time ?? 480);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${displayHour}:${m.toString().padStart(2, '0')} ${period}`;
  }

  getTimePeriod() {
    const totalMinutes = this.state?.time ?? 480;
    const h = Math.floor(totalMinutes / 60);
    if (h < 12) return 'morning';
    if (h < 17) return 'afternoon';
    return 'evening';
  }

  advanceDay() {
    const gs = this.state;
    if (!gs) return;

    gs.time = 480;
    gs.day = (gs.day ?? 1) + 1;

    this.scene.events?.emit('day-advanced');
    this.scene.events?.emit('hud-update');
  }
}
