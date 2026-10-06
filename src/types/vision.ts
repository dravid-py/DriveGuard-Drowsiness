export interface NormalizedLandmark {
  x: number;
  y: number;
  z: number;
}

export interface EyeLandmarksData {
  leftEye: NormalizedLandmark[];
  rightEye: NormalizedLandmark[];
  faceDetected: boolean;
  timestamp: number;
}

export type CameraStatusCode =
  | 'idle'
  | 'requesting'
  | 'ready'
  | 'stopped'
  | 'error';

export type VisionStatusCode =
  | 'uninitialized'
  | 'loading_wasm'
  | 'loading_model'
  | 'ready'
  | 'detecting'
  | 'error';

export type CameraErrorCode =
  | 'PERMISSION_DENIED'
  | 'NOT_FOUND'
  | 'IN_USE'
  | 'UNSUPPORTED'
  | 'UNKNOWN';

export interface CameraErrorDetail {
  code: CameraErrorCode;
  title: string;
  message: string;
  advice: string;
}
