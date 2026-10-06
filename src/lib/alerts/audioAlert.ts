/**
 * Native Browser Web Audio API Service for DriveGuard.
 * Generates controlled, pleasant attention chimes without external audio dependencies.
 */

let sharedAudioCtx: AudioContext | null = null;
let activeOscillators: OscillatorNode[] = [];
let audioTimeoutId: number | null = null;

function getOrCreateAudioContext(): AudioContext | null {
  try {
    if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        sharedAudioCtx = new AudioCtxClass();
      }
    }
    if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch((err) => {
        console.warn('AudioContext resume deferred:', err);
      });
    }
    return sharedAudioCtx;
  } catch (err) {
    console.warn('Web Audio API not supported or initialization failed:', err);
    return null;
  }
}

/**
 * Plays a soft dual-tone attention chime pulse.
 * @param volume 0-100 percentage
 */
export function playAlertChime(volume = 80): void {
  try {
    const ctx = getOrCreateAudioContext();
    if (!ctx) return;

    // Stop any currently playing audio pulse before starting a new one
    stopAlertAudio();

    const normalizedVol = Math.max(0, Math.min(1, (volume / 100) * 0.3)); // capped at safe gain 0.3
    const now = ctx.currentTime;

    // Pulse 1: 880 Hz (A5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(normalizedVol, now + 0.05);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Pulse 2: 660 Hz (E5) delayed slightly
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(660, now + 0.15);
    gain2.gain.setValueAtTime(0, now + 0.15);
    gain2.gain.linearRampToValueAtTime(normalizedVol * 0.9, now + 0.2);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.55);

    activeOscillators = [osc1, osc2];

    // Clear reference after completion
    audioTimeoutId = window.setTimeout(() => {
      activeOscillators = [];
      audioTimeoutId = null;
    }, 600);
  } catch (err) {
    console.warn('Audio playback error (non-fatal):', err);
  }
}

export function stopAlertAudio(): void {
  if (audioTimeoutId !== null) {
    clearTimeout(audioTimeoutId);
    audioTimeoutId = null;
  }

  activeOscillators.forEach((osc) => {
    try {
      osc.stop();
      osc.disconnect();
    } catch {
      // Ignored if already stopped
    }
  });
  activeOscillators = [];
}

export function disposeAudio(): void {
  stopAlertAudio();
  if (sharedAudioCtx && sharedAudioCtx.state !== 'closed') {
    try {
      sharedAudioCtx.close().catch(() => {});
    } catch {
      // Ignored
    }
    sharedAudioCtx = null;
  }
}
