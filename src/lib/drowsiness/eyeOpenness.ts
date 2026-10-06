import type { NormalizedLandmark } from '../../types/vision';
import type { EyeOpennessMetrics, EyeState } from './drowsinessTypes';

/**
 * Computes 3D Euclidean distance between two normalized facial landmark points.
 */
function euclideanDistance3D(p1: NormalizedLandmark, p2: NormalizedLandmark): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  const dz = (p1.z || 0) - (p2.z || 0);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Computes Eye Aspect Ratio (EAR) for the Left Eye:
 * Horizontal: 33 (outer corner) to 133 (inner corner)
 * Vertical 1: 160 (upper eyelid) to 144 (lower eyelid)
 * Vertical 2: 158 (upper eyelid) to 153 (lower eyelid)
 */
function calculateLeftEAR(landmarks: NormalizedLandmark[]): number {
  const p33 = landmarks[33];
  const p133 = landmarks[133];
  const p160 = landmarks[160];
  const p144 = landmarks[144];
  const p158 = landmarks[158];
  const p153 = landmarks[153];

  if (!p33 || !p133 || !p160 || !p144 || !p158 || !p153) {
    return 0;
  }

  const horizontal = euclideanDistance3D(p33, p133);
  if (horizontal < 1e-6) return 0;

  const vertical1 = euclideanDistance3D(p160, p144);
  const vertical2 = euclideanDistance3D(p158, p153);

  return (vertical1 + vertical2) / (2.0 * horizontal);
}

/**
 * Computes Eye Aspect Ratio (EAR) for the Right Eye:
 * Horizontal: 362 (inner corner) to 263 (outer corner)
 * Vertical 1: 385 (upper eyelid) to 380 (lower eyelid)
 * Vertical 2: 387 (upper eyelid) to 373 (lower eyelid)
 */
function calculateRightEAR(landmarks: NormalizedLandmark[]): number {
  const p362 = landmarks[362];
  const p263 = landmarks[263];
  const p385 = landmarks[385];
  const p380 = landmarks[380];
  const p387 = landmarks[387];
  const p373 = landmarks[373];

  if (!p362 || !p263 || !p385 || !p380 || !p387 || !p373) {
    return 0;
  }

  const horizontal = euclideanDistance3D(p362, p263);
  if (horizontal < 1e-6) return 0;

  const vertical1 = euclideanDistance3D(p385, p380);
  const vertical2 = euclideanDistance3D(p387, p373);

  return (vertical1 + vertical2) / (2.0 * horizontal);
}

export class EyeOpennessCalculator {
  private smoothingWindow: number[] = [];
  private windowSize: number;

  constructor(windowSize = 5) {
    this.windowSize = Math.max(1, windowSize);
  }

  public setWindowSize(size: number): void {
    this.windowSize = Math.max(1, size);
    if (this.smoothingWindow.length > this.windowSize) {
      this.smoothingWindow = this.smoothingWindow.slice(-this.windowSize);
    }
  }

  public reset(): void {
    this.smoothingWindow = [];
  }

  public calculate(
    landmarks: NormalizedLandmark[] | undefined | null,
    closureThreshold: number
  ): EyeOpennessMetrics {
    if (!landmarks || landmarks.length === 0) {
      this.reset();
      return {
        leftEAR: 0,
        rightEAR: 0,
        averageEAR: 0,
        smoothedEAR: 0,
        eyeState: 'UNKNOWN',
      };
    }

    const leftEAR = calculateLeftEAR(landmarks);
    const rightEAR = calculateRightEAR(landmarks);
    const averageEAR = (leftEAR + rightEAR) / 2.0;

    // Moving average smoothing
    this.smoothingWindow.push(averageEAR);
    if (this.smoothingWindow.length > this.windowSize) {
      this.smoothingWindow.shift();
    }

    const sum = this.smoothingWindow.reduce((acc, val) => acc + val, 0);
    const smoothedEAR = sum / this.smoothingWindow.length;

    // Determine discrete EyeState
    let eyeState: EyeState = 'OPEN';
    if (smoothedEAR < closureThreshold * 0.95) {
      eyeState = 'CLOSED';
    } else if (smoothedEAR < closureThreshold * 1.15) {
      eyeState = 'CLOSING';
    } else {
      eyeState = 'OPEN';
    }

    return {
      leftEAR,
      rightEAR,
      averageEAR,
      smoothedEAR,
      eyeState,
    };
  }
}
