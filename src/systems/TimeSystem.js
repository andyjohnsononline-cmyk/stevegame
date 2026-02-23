const SEASON_NAMES = ['Spring', 'Summer', 'Autumn', 'Winter'];
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export class TimeSystem {
  constructor(scene) {
    this.scene = scene;
    this.accumulator = 0;
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

  getSeasonName() {
    return SEASON_NAMES[this.state?.season ?? 0];
  }

  getDayOfWeek() {
    const day = this.state?.day ?? 1;
    return DAY_NAMES[(day - 1) % 7];
  }

  getDaylightAlpha() {
    const totalMinutes = this.state?.time ?? 480;
    const h = totalMinutes / 60;
    if (h <= 6) return 0.15;
    if (h <= 8) return 0.15 + (h - 6) * 0.425;
    if (h <= 18) return 1.0;
    if (h <= 21) return 1.0 - (h - 18) * 0.283;
    return 0.15;
  }

  advanceDay() {
    const gs = this.state;
    if (!gs) return;

    gs.time = 480;
    gs.day = (gs.day ?? 1) + 1;

    if (gs.day > 28) {
      gs.day = 1;
      gs.season = (gs.season ?? 0) + 1;
    }
    if (gs.season > 3) {
      gs.season = 0;
      gs.year = (gs.year ?? 1) + 1;
    }

    if (gs.flags) gs.flags.giftedToday = {};

    this.scene.events?.emit('day-advanced');
    this.scene.events?.emit('hud-update');
  }
}
