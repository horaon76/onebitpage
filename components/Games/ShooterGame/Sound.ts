// Global AudioContext to prevent multiple instances
let audioCtx;
export default audioCtx;
if (typeof window !== "undefined") {
  audioCtx = new (window.AudioContext || window?.["webkitAudioContext"])();
}

export function ensureAudioContext() {
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

// ✅ Simple Beep Sound
export function playBeep(isMuted) {
  if(isMuted) return;
  ensureAudioContext();

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
  gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.1);
}

// ✅ Shooting Sound (Laser Effect)
export function playShootSound(isMuted) {
  if(isMuted) return;
  ensureAudioContext();

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(1500, audioCtx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(
    200,
    audioCtx.currentTime + 0.1
  );

  gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.15);
}

// ✅ Victory Melody 🎺🎶 (Trumpet-Like)
export function playVictoryMelody(isMuted) {
  if(isMuted) return;
  ensureAudioContext();

  function playNote(frequency, startTime, duration) {
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime + startTime);
    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime + startTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioCtx.currentTime + startTime + duration
    );

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start(audioCtx.currentTime + startTime);
    osc.stop(audioCtx.currentTime + startTime + duration);
  }

  playNote(523, 0.0, 0.3);
  playNote(659, 0.3, 0.3);
  playNote(784, 0.6, 0.3);
  playNote(880, 1.0, 0.5);
}

// ✅ Game Over Sound 💥 (Boom + Splash)
export function playGameOverSound(isMuted) {
  if(isMuted) return;
  ensureAudioContext();

  function playSplash(startTime) {
    const whiteNoise = audioCtx.createBufferSource();
    const bufferSize = audioCtx.sampleRate * 0.5;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    whiteNoise.buffer = buffer;
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime + startTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioCtx.currentTime + startTime + 0.5
    );

    whiteNoise.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    whiteNoise.start(audioCtx.currentTime + startTime);
  }

  playSplash(0.3);
}
