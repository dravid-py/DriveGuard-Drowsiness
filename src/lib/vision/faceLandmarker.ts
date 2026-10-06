import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import type { VisionStatusCode } from '../../types/vision';

// Official version-compatible Face Landmarker model asset
const FACE_LANDMARKER_MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

// Version-pinned CDN fallback
const CDN_WASM_FALLBACK =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.21/wasm';

let faceLandmarkerInstance: FaceLandmarker | null = null;
let initPromise: Promise<FaceLandmarker> | null = null;

export async function getFaceLandmarker(
  onStatusUpdate?: (status: VisionStatusCode) => void
): Promise<FaceLandmarker> {
  if (faceLandmarkerInstance) {
    onStatusUpdate?.('ready');
    return faceLandmarkerInstance;
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    try {
      onStatusUpdate?.('loading_wasm');

      // Try loading local WASM binaries first, falling back to CDN
      let visionFileset;
      try {
        visionFileset = await FilesetResolver.forVisionTasks('/wasm');
      } catch (localWasmErr) {
        console.warn('Local WASM fileset failed to load, falling back to CDN:', localWasmErr);
        visionFileset = await FilesetResolver.forVisionTasks(CDN_WASM_FALLBACK);
      }

      onStatusUpdate?.('loading_model');

      const landmarker = await FaceLandmarker.createFromOptions(visionFileset, {
        baseOptions: {
          modelAssetPath: FACE_LANDMARKER_MODEL_URL,
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numFaces: 1,
        minFaceDetectionConfidence: 0.5,
        minFacePresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
        outputFaceBlendshapes: false,
        outputFacialTransformationMatrixes: false,
      });

      faceLandmarkerInstance = landmarker;
      onStatusUpdate?.('ready');
      return landmarker;
    } catch (err) {
      console.error('Failed to initialize MediaPipe FaceLandmarker with GPU, retrying with CPU...', err);
      // Fallback to CPU delegate if GPU delegate fails
      try {
        let visionFileset;
        try {
          visionFileset = await FilesetResolver.forVisionTasks('/wasm');
        } catch {
          visionFileset = await FilesetResolver.forVisionTasks(CDN_WASM_FALLBACK);
        }

        const landmarker = await FaceLandmarker.createFromOptions(visionFileset, {
          baseOptions: {
            modelAssetPath: FACE_LANDMARKER_MODEL_URL,
            delegate: 'CPU',
          },
          runningMode: 'VIDEO',
          numFaces: 1,
          minFaceDetectionConfidence: 0.5,
          minFacePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        faceLandmarkerInstance = landmarker;
        onStatusUpdate?.('ready');
        return landmarker;
      } catch (cpuErr) {
        onStatusUpdate?.('error');
        console.error('MediaPipe FaceLandmarker initialization failed on both GPU and CPU:', cpuErr);
        throw cpuErr;
      }
    } finally {
      initPromise = null;
    }
  })();

  return initPromise;
}

export function disposeFaceLandmarker(): void {
  if (faceLandmarkerInstance) {
    try {
      faceLandmarkerInstance.close();
    } catch (err) {
      console.warn('Error while closing FaceLandmarker instance:', err);
    }
    faceLandmarkerInstance = null;
  }
}
