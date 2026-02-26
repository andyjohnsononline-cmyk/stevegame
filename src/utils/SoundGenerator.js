let ctx = null;

function getCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  return ctx;
}

function playTone(freq, duration, type = 'square', volume = 0.15, detune = 0) {
  const ac = getCtx();
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.detune.value = detune;
  gain.gain.setValueAtTime(volume, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(ac.currentTime);
  osc.stop(ac.currentTime + duration);
}

function noise(duration, volume = 0.08) {
  const ac = getCtx();
  const bufferSize = ac.sampleRate * duration;
  const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const src = ac.createBufferSource();
  src.buffer = buffer;
  const gain = ac.createGain();
  gain.gain.setValueAtTime(volume, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
  src.connect(gain);
  gain.connect(ac.destination);
  src.start(ac.currentTime);
}

export const SFX = {
  tap() {
    playTone(300 + Math.random() * 100, 0.06, 'square', 0.08);
  },

  hit() {
    playTone(120, 0.08, 'square', 0.12);
    noise(0.05, 0.06);
  },

  kill() {
    playTone(400, 0.1, 'square', 0.12);
    playTone(600, 0.15, 'square', 0.08);
    noise(0.1, 0.08);
  },

  bossKill() {
    const ac = getCtx();
    const t = ac.currentTime;
    [523, 659, 784, 1047].forEach((freq, i) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'square';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.12, t + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.25);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(t + i * 0.08);
      osc.stop(t + i * 0.08 + 0.25);
    });
  },

  bossFail() {
    playTone(200, 0.2, 'sawtooth', 0.1);
    playTone(150, 0.3, 'sawtooth', 0.06);
  },

  collect(pitch = 0) {
    const freq = 600 + pitch * 80;
    playTone(freq, 0.08, 'square', 0.08);
    playTone(freq * 1.5, 0.06, 'square', 0.05);
  },

  hire() {
    const ac = getCtx();
    const t = ac.currentTime;
    [523, 659, 784].forEach((freq, i) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'square';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.1, t + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.2);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(t + i * 0.08);
      osc.stop(t + i * 0.08 + 0.2);
    });
  },

  skill() {
    const ac = getCtx();
    const t = ac.currentTime;
    [392, 494, 587, 784].forEach((freq, i) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'square';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.12, t + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.1 + 0.3);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(t + i * 0.1);
      osc.stop(t + i * 0.1 + 0.3);
    });
  },

  prestige() {
    const ac = getCtx();
    const t = ac.currentTime;
    [440, 554, 659, 880, 1100].forEach((freq, i) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.1, t + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.12 + 0.4);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(t + i * 0.12);
      osc.stop(t + i * 0.12 + 0.4);
    });
  },

  uiOpen() {
    playTone(440, 0.06, 'sine', 0.06);
  },

  uiClose() {
    playTone(330, 0.06, 'sine', 0.06);
  },
};
