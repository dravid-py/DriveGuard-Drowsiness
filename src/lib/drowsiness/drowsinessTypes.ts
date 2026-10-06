export type DrowsinessState =
  | 'UNKNOWN'
  | 'NORMAL'
  | 'EYES_CLOSING'
  | 'EYES_CLOSED'
  | 'DROWSINESS_WARNING'
  | 'DROWSINESS_DETECTED';

export type EyeState = 'UNKNOWN' | 'OPEN' | 'CLOSING' | 'CLOSED';

export type DrowsinessEventType =
  | 'LONG_EYE_CLOSURE'
  | 'DROWSINESS_WARNING'
  | 'DROWSINESS_DETECTED'
  | 'ALERT_ACKNOWLEDGED';

export interface EyeOpennessMetrics {
  leftEAR: number;
  rightEAR: number;
  averageEAR: number;
  smoothedEAR: number;
  eyeState: EyeState;
}

export interface DrowsinessConfig {
  eyeClosureThreshold: number; // EAR threshold below which eye is considered closed (e.g., 0.21)
  prolongedClosureMs: number; // Time before warning (e.g., 1500ms)
  warningDurationMs: number; // Time in warning before confirmed alert (e.g., 1000ms)
  cooldownMs: number; // Cooldown after confirmed alert (e.g., 5000ms)
  smoothingWindowSize: number; // Frames for EAR moving average (e.g., 5)
  enableVisualAlert: boolean;
  enableAudioAlert: boolean;
  alertVolume: number;
}

export interface DrowsinessEvaluation {
  state: DrowsinessState;
  eyeState: EyeState;
  eyeOpenness: number; // smoothed EAR
  rawEAR: number;
  closureDurationMs: number;
  shouldAlert: boolean;
  isInCooldown: boolean;
  eventTriggered?: DrowsinessEventType;
}
