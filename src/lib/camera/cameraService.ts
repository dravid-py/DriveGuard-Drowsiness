import type { CameraErrorDetail } from '../../types/vision';

export const DEFAULT_CAMERA_CONSTRAINTS: MediaStreamConstraints = {
  video: {
    facingMode: 'user',
    width: { ideal: 1280 },
    height: { ideal: 720 },
  },
  audio: false,
};

export function parseCameraError(error: unknown): CameraErrorDetail {
  const errName = error instanceof Error ? error.name : String(error);

  switch (errName) {
    case 'NotAllowedError':
    case 'PermissionDeniedError':
      return {
        code: 'PERMISSION_DENIED',
        title: 'CAMERA ACCESS DENIED',
        message: 'DriveGuard needs camera access to analyze facial landmarks locally.',
        advice: 'Please click the lock/camera icon in your browser address bar and change permissions to Allow.',
      };

    case 'NotFoundError':
    case 'DevicesNotFoundError':
      return {
        code: 'NOT_FOUND',
        title: 'NO CAMERA FOUND',
        message: 'No compatible camera was detected on this device.',
        advice: 'Please ensure your webcam or built-in laptop camera is properly connected and recognized by your system.',
      };

    case 'NotReadableError':
    case 'TrackStartError':
      return {
        code: 'IN_USE',
        title: 'CAMERA UNAVAILABLE',
        message: 'The camera may already be in use by another application.',
        advice: 'Please close other applications using the webcam (e.g. Zoom, Teams, Skype, or other browser tabs) and try again.',
      };

    case 'NotSupportedError':
    case 'TypeError':
      return {
        code: 'UNSUPPORTED',
        title: 'BROWSER UNSUPPORTED',
        message: 'Your browser does not support the required camera access features.',
        advice: 'Please open DriveGuard in a modern browser such as Chrome, Edge, Brave, or Firefox.',
      };

    default:
      return {
        code: 'UNKNOWN',
        title: 'CAMERA INITIALIZATION ERROR',
        message: error instanceof Error ? error.message : 'An unexpected error occurred while starting the camera.',
        advice: 'Please refresh the page and ensure your webcam permissions are enabled.',
      };
  }
}

export async function requestCameraStream(
  constraints: MediaStreamConstraints = DEFAULT_CAMERA_CONSTRAINTS
): Promise<MediaStream> {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('NotSupportedError');
  }

  return await navigator.mediaDevices.getUserMedia(constraints);
}

export function stopCameraStream(stream: MediaStream | null): void {
  if (!stream) return;
  try {
    const tracks = stream.getTracks();
    tracks.forEach((track) => {
      try {
        track.stop();
      } catch (err) {
        console.warn('Error stopping track:', err);
      }
    });
  } catch (err) {
    console.warn('Error accessing tracks for cleanup:', err);
  }
}
