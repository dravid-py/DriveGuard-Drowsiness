import type { NormalizedLandmark } from '../../types/vision';
import type { DrowsinessConfig, DrowsinessEvaluation, DrowsinessState, DrowsinessEventType } from './drowsinessTypes';
import { EyeOpennessCalculator } from './eyeOpenness';

export class DrowsinessEngine {
  private calculator: EyeOpennessCalculator;
  private closureStartTime: number | null = null;
  private currentState: DrowsinessState = 'UNKNOWN';
  private cooldownUntil = 0;
  private hasLoggedWarningForCurrentClosure = false;
  private hasLoggedAlertForCurrentClosure = false;

  constructor(smoothingWindowSize = 5) {
    this.calculator = new EyeOpennessCalculator(smoothingWindowSize);
  }

  public reset(): void {
    this.closureStartTime = null;
    this.currentState = 'UNKNOWN';
    this.cooldownUntil = 0;
    this.hasLoggedWarningForCurrentClosure = false;
    this.hasLoggedAlertForCurrentClosure = false;
    this.calculator.reset();
  }

  public acknowledgeAlert(timestamp: number, cooldownDurationMs = 5000): void {
    this.closureStartTime = null;
    this.hasLoggedWarningForCurrentClosure = false;
    this.hasLoggedAlertForCurrentClosure = false;
    this.cooldownUntil = timestamp + cooldownDurationMs;
    this.currentState = 'NORMAL';
  }

  public processFrame(
    landmarks: NormalizedLandmark[] | undefined | null,
    timestamp: number,
    config: DrowsinessConfig
  ): DrowsinessEvaluation {
    this.calculator.setWindowSize(config.smoothingWindowSize);

    // 1. If face is missing or lost -> reset timers and transition to UNKNOWN
    if (!landmarks || landmarks.length === 0) {
      this.closureStartTime = null;
      this.hasLoggedWarningForCurrentClosure = false;
      this.hasLoggedAlertForCurrentClosure = false;
      this.currentState = 'UNKNOWN';
      this.calculator.reset();

      return {
        state: 'UNKNOWN',
        eyeState: 'UNKNOWN',
        eyeOpenness: 0,
        rawEAR: 0,
        closureDurationMs: 0,
        shouldAlert: false,
        isInCooldown: timestamp < this.cooldownUntil,
      };
    }

    // 2. Compute real-time EAR metrics
    const metrics = this.calculator.calculate(landmarks, config.eyeClosureThreshold);
    const isInCooldown = timestamp < this.cooldownUntil;

    let eventTriggered: DrowsinessEventType | undefined;
    let shouldAlert = false;
    let closureDurationMs = 0;

    // 3. State Evaluation
    if (metrics.eyeState === 'OPEN') {
      // Eyes are open -> reset closure sequence
      this.closureStartTime = null;
      this.hasLoggedWarningForCurrentClosure = false;
      this.hasLoggedAlertForCurrentClosure = false;
      this.currentState = 'NORMAL';
    } else if (metrics.eyeState === 'CLOSING') {
      if (this.closureStartTime === null) {
        this.closureStartTime = timestamp;
      }
      closureDurationMs = timestamp - this.closureStartTime;
      this.currentState = 'EYES_CLOSING';
    } else if (metrics.eyeState === 'CLOSED') {
      if (this.closureStartTime === null) {
        this.closureStartTime = timestamp;
      }
      closureDurationMs = timestamp - this.closureStartTime;

      if (closureDurationMs < config.prolongedClosureMs) {
        // Normal blink or brief closure (under prolonged threshold) -> NO alert
        this.currentState = 'EYES_CLOSED';
      } else if (closureDurationMs < config.prolongedClosureMs + config.warningDurationMs) {
        // Prolonged closure reaching warning phase
        this.currentState = 'DROWSINESS_WARNING';
        if (!this.hasLoggedWarningForCurrentClosure) {
          this.hasLoggedWarningForCurrentClosure = true;
          eventTriggered = 'LONG_EYE_CLOSURE';
        }
      } else {
        // Confirmed prolonged eye closure
        this.currentState = 'DROWSINESS_DETECTED';

        if (!this.hasLoggedAlertForCurrentClosure && !isInCooldown) {
          this.hasLoggedAlertForCurrentClosure = true;
          shouldAlert = config.enableVisualAlert || config.enableAudioAlert;
          this.cooldownUntil = timestamp + config.cooldownMs;
          eventTriggered = 'DROWSINESS_DETECTED';
        }
      }
    }

    return {
      state: this.currentState,
      eyeState: metrics.eyeState,
      eyeOpenness: metrics.smoothedEAR,
      rawEAR: metrics.averageEAR,
      closureDurationMs,
      shouldAlert,
      isInCooldown,
      eventTriggered,
    };
  }
}
