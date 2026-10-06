import type { NormalizedLandmark, EyeLandmarksData } from '../../types/vision';

/**
 * Standard MediaPipe Face Mesh Landmark Indices (468/478 points):
 * 
 * Left Eye Contour (16 points):
 * 33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246
 *
 * Right Eye Contour (16 points):
 * 362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398
 */

export const LEFT_EYE_INDICES = [
  33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246
] as const;

export const RIGHT_EYE_INDICES = [
  362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398
] as const;

// Key anatomical eye landmarks for EAR (prepared for Master 3)
export const LEFT_EYE_KEYPOINTS = {
  innerCorner: 133,
  outerCorner: 33,
  top1: 159,
  top2: 158,
  bottom1: 145,
  bottom2: 153,
} as const;

export const RIGHT_EYE_KEYPOINTS = {
  innerCorner: 362,
  outerCorner: 263,
  top1: 386,
  top2: 387,
  bottom1: 374,
  bottom2: 373,
} as const;

// Subtle face contour outline for visualization
export const FACE_OVAL_INDICES = [
  10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378,
  400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21,
  54, 103, 67, 109
] as const;

/**
 * Extracts left and right eye landmark coordinates from raw MediaPipe face landmarks.
 * In Master 2, this provides the clean landmark data structure without computing EAR or open/closed states.
 */
export function extractEyeLandmarks(
  landmarks: NormalizedLandmark[] | undefined | null,
  timestamp: number
): EyeLandmarksData {
  if (!landmarks || landmarks.length === 0) {
    return {
      leftEye: [],
      rightEye: [],
      faceDetected: false,
      timestamp,
    };
  }

  const leftEye: NormalizedLandmark[] = [];
  for (const idx of LEFT_EYE_INDICES) {
    if (landmarks[idx]) {
      leftEye.push(landmarks[idx]);
    }
  }

  const rightEye: NormalizedLandmark[] = [];
  for (const idx of RIGHT_EYE_INDICES) {
    if (landmarks[idx]) {
      rightEye.push(landmarks[idx]);
    }
  }

  return {
    leftEye,
    rightEye,
    faceDetected: true,
    timestamp,
  };
}
