import type { AppSettings, SensitivityLevel } from '../../types';
import type { DrowsinessConfig } from './drowsinessTypes';

export const DEFAULT_DROWSINESS_CONFIG: DrowsinessConfig = {
  eyeClosureThreshold: 0.21,
  prolongedClosureMs: 1500,
  warningDurationMs: 1000,
  cooldownMs: 5000,
  smoothingWindowSize: 5,
  enableVisualAlert: true,
  enableAudioAlert: true,
  alertVolume: 80,
};

// Sensitivity multiplier presets for EAR threshold and closure duration
const SENSITIVITY_PROFILES: Record<
  SensitivityLevel,
  { earThreshold: number; closureMultiplier: number }
> = {
  low: {
    earThreshold: 0.18, // More tolerant (eyes must be more firmly shut)
    closureMultiplier: 1.25, // Longer closure needed
  },
  medium: {
    earThreshold: 0.21, // Standard balanced threshold
    closureMultiplier: 1.0,
  },
  high: {
    earThreshold: 0.24, // Higher sensitivity (triggers sooner)
    closureMultiplier: 0.8,
  },
};

export function buildDrowsinessConfig(settings: AppSettings): DrowsinessConfig {
  const profile = SENSITIVITY_PROFILES[settings.drowsinessSensitivity] || SENSITIVITY_PROFILES.medium;

  // Base closure time derived from user-configured slider (in seconds, e.g., 2.0s -> 2000ms),
  // adjusted by the selected sensitivity profile.
  const baseClosureMs = (settings.eyeClosureThreshold || 2.0) * 1000;
  const prolongedClosureMs = Math.max(800, Math.round(baseClosureMs * profile.closureMultiplier));

  return {
    eyeClosureThreshold: profile.earThreshold,
    prolongedClosureMs,
    warningDurationMs: 1000,
    cooldownMs: 5000,
    smoothingWindowSize: 5,
    enableVisualAlert: settings.enableVisualAlert ?? true,
    enableAudioAlert: settings.enableAudioAlert ?? true,
    alertVolume: settings.alertVolume ?? 80,
  };
}
