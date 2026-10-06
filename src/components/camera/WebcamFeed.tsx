import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { EyeLandmarksData, CameraErrorDetail, VisionStatusCode, NormalizedLandmark } from '../../types/vision';
import { getFaceLandmarker } from '../../lib/vision/faceLandmarker';
import { extractEyeLandmarks } from '../../lib/vision/eyeLandmarks';
import { requestCameraStream, stopCameraStream, parseCameraError } from '../../lib/camera/cameraService';
import { FaceLandmarkOverlay } from './FaceLandmarkOverlay';
import type { FaceLandmarkOverlayHandle } from './FaceLandmarkOverlay';
import { ShieldCheck, Loader2, CameraOff } from 'lucide-react';
import type { FaceLandmarker } from '@mediapipe/tasks-vision';

interface WebcamFeedProps {
  onFaceStatusChange?: (detected: boolean) => void;
  onEyeLandmarksReady?: (data: EyeLandmarksData) => void;
  onLandmarksProcessed?: (landmarks: NormalizedLandmark[] | undefined, timestamp: number) => void;
  onCameraError?: (error: CameraErrorDetail) => void;
  showOverlay?: boolean;
}

export const WebcamFeed: React.FC<WebcamFeedProps> = ({
  onFaceStatusChange,
  onEyeLandmarksReady,
  onLandmarksProcessed,
  onCameraError,
  showOverlay = true,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const overlayRef = useRef<FaceLandmarkOverlayHandle | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const landmarkerRef = useRef<FaceLandmarker | null>(null);
  const isRunningRef = useRef<boolean>(false);
  const lastVideoTimeRef = useRef<number>(-1);
  const faceDetectedStateRef = useRef<boolean>(false);

  const [visionStatus, setVisionStatus] = useState<VisionStatusCode>('loading_wasm');
  const [cameraReady, setCameraReady] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Stable cleanup function
  const cleanupAll = useCallback(() => {
    isRunningRef.current = false;

    if (animFrameIdRef.current !== null) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }

    if (streamRef.current) {
      stopCameraStream(streamRef.current);
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (overlayRef.current) {
      overlayRef.current.clear();
    }
  }, []);

  // Main real-time video processing loop
  const processFrame = useCallback(() => {
    if (!isRunningRef.current) return;

    const video = videoRef.current;
    const landmarker = landmarkerRef.current;
    const overlay = overlayRef.current;

    if (
      video &&
      landmarker &&
      video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
      !video.paused &&
      !video.ended
    ) {
      const currentTime = video.currentTime;

      // Avoid redundant processing on unchanged video timestamps
      if (currentTime !== lastVideoTimeRef.current) {
        lastVideoTimeRef.current = currentTime;
        const now = performance.now();

        try {
          const results = landmarker.detectForVideo(video, now);
          const rawFaceLandmarks = results.faceLandmarks?.[0] as NormalizedLandmark[] | undefined;

          if (rawFaceLandmarks && rawFaceLandmarks.length > 0) {
            // Face DETECTED
            if (!faceDetectedStateRef.current) {
              faceDetectedStateRef.current = true;
              onFaceStatusChange?.(true);
            }

            // Draw subtle mirrored landmarks on canvas
            if (showOverlay && overlay) {
              overlay.drawLandmarks(rawFaceLandmarks, video.videoWidth, video.videoHeight);
            }

            // Extract eye landmark data structure for Master 3
            if (onEyeLandmarksReady) {
              const eyeData = extractEyeLandmarks(rawFaceLandmarks, now);
              onEyeLandmarksReady(eyeData);
            }

            if (onLandmarksProcessed) {
              onLandmarksProcessed(rawFaceLandmarks, now);
            }
          } else {
            // Face NOT detected
            if (faceDetectedStateRef.current) {
              faceDetectedStateRef.current = false;
              onFaceStatusChange?.(false);
            }

            if (overlay) {
              overlay.clear();
            }

            if (onEyeLandmarksReady) {
              onEyeLandmarksReady(extractEyeLandmarks(null, now));
            }

            if (onLandmarksProcessed) {
              onLandmarksProcessed(undefined, now);
            }
          }
        } catch (visionErr) {
          console.warn('Frame detection error:', visionErr);
        }
      }
    }

    // Schedule next frame in browser loop
    if (isRunningRef.current) {
      animFrameIdRef.current = requestAnimationFrame(processFrame);
    }
  }, [onFaceStatusChange, onEyeLandmarksReady, onLandmarksProcessed, showOverlay]);

  // Initialize camera and MediaPipe on mount
  useEffect(() => {
    let isMounted = true;
    isRunningRef.current = true;

    async function initPipeline() {
      try {
        // 1. Start Camera
        const stream = await requestCameraStream();
        if (!isMounted) {
          stopCameraStream(stream);
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setCameraReady(true);
        }

        // 2. Initialize MediaPipe FaceLandmarker
        const landmarker = await getFaceLandmarker((status) => {
          if (isMounted) setVisionStatus(status);
        });

        if (!isMounted) return;

        landmarkerRef.current = landmarker;
        setVisionStatus('ready');

        // 3. Start real-time detection loop
        animFrameIdRef.current = requestAnimationFrame(processFrame);
      } catch (err) {
        if (!isMounted) return;
        console.error('Failed to initialize webcam pipeline:', err);
        const parsed = parseCameraError(err);
        setErrorMessage(parsed.message);
        onCameraError?.(parsed);
      }
    }

    initPipeline();

    // Cleanup on unmount or navigation away
    return () => {
      isMounted = false;
      cleanupAll();
    };
  }, [cleanupAll, onCameraError, processFrame]);

  return (
    <div className="relative w-full h-full bg-black/80 flex items-center justify-center overflow-hidden rounded-xl">
      {/* Video element - mirrored horizontally for natural user webcam experience */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover transform -scale-x-100"
      />

      {/* High-performance landmark drawing canvas */}
      <FaceLandmarkOverlay ref={overlayRef} />

      {/* Loading Overlay */}
      {(!cameraReady || visionStatus === 'loading_wasm' || visionStatus === 'loading_model') && !errorMessage && (
        <div className="absolute inset-0 z-20 bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              {visionStatus === 'loading_wasm' && 'INITIALIZING LOCAL VISION RUNTIME...'}
              {visionStatus === 'loading_model' && 'INITIALIZING FACE DETECTION MODEL...'}
              {cameraReady && visionStatus === 'ready' && 'STARTING FACE TRACKING...'}
              {!cameraReady && 'CONNECTING TO LOCAL WEBCAM...'}
            </h3>
            <p className="text-xs text-slate-400 max-w-xs">
              Loading local WebAssembly runtime on your device. Zero data is uploaded.
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {errorMessage && (
        <div className="absolute inset-0 z-20 bg-background/95 flex flex-col items-center justify-center p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-rose-950/80 border border-rose-500/50 flex items-center justify-center text-rose-400">
            <CameraOff className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wide">
            CAMERA FEED ERROR
          </h3>
          <p className="text-xs text-slate-400 max-w-sm">{errorMessage}</p>
        </div>
      )}

      {/* Real-time local processing badge */}
      <div className="absolute top-3 left-3 z-20 pointer-events-none">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md border border-surface-border text-[11px] font-mono text-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>LOCAL PROCESSING</span>
        </div>
      </div>
    </div>
  );
};
