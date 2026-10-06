import { forwardRef, useImperativeHandle, useRef } from 'react';
import type { NormalizedLandmark } from '../../types/vision';
import { LEFT_EYE_INDICES, RIGHT_EYE_INDICES, FACE_OVAL_INDICES } from '../../lib/vision/eyeLandmarks';

export interface FaceLandmarkOverlayHandle {
  drawLandmarks: (landmarks: NormalizedLandmark[] | null, width: number, height: number) => void;
  clear: () => void;
}

export const FaceLandmarkOverlay = forwardRef<FaceLandmarkOverlayHandle, { className?: string }>(
  ({ className }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useImperativeHandle(ref, () => ({
      drawLandmarks: (landmarks, width, height) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, width, height);

        if (!landmarks || landmarks.length === 0) {
          return;
        }

        // Draw helper to connect an array of indices with mirrored X coords
        const drawContour = (
          indices: readonly number[],
          strokeColor: string,
          lineWidth: number,
          closed = true,
          fillColor?: string
        ) => {
          ctx.beginPath();
          let started = false;

          for (const idx of indices) {
            const pt = landmarks[idx];
            if (!pt) continue;

            // Mirror X coordinate since video is rendered mirrored (transform: scaleX(-1))
            const x = (1 - pt.x) * width;
            const y = pt.y * height;

            if (!started) {
              ctx.moveTo(x, y);
              started = true;
            } else {
              ctx.lineTo(x, y);
            }
          }

          if (closed && started) {
            ctx.closePath();
          }

          if (fillColor) {
            ctx.fillStyle = fillColor;
            ctx.fill();
          }

          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = lineWidth;
          ctx.stroke();
        };

        // 1. Subtle Face Oval Outline
        drawContour(
          FACE_OVAL_INDICES,
          'rgba(16, 185, 129, 0.25)', // emerald with subtle opacity
          1.5,
          true
        );

        // 2. Left Eye Contour
        drawContour(
          LEFT_EYE_INDICES,
          'rgba(52, 211, 153, 0.85)', // emerald-400
          2,
          true,
          'rgba(16, 185, 129, 0.1)'
        );

        // 3. Right Eye Contour
        drawContour(
          RIGHT_EYE_INDICES,
          'rgba(52, 211, 153, 0.85)', // emerald-400
          2,
          true,
          'rgba(16, 185, 129, 0.1)'
        );

        // 4. Subtle center pupil / iris dots if 478-landmark model is active
        if (landmarks[468]) {
          const pt = landmarks[468];
          const x = (1 - pt.x) * width;
          const y = pt.y * height;
          ctx.beginPath();
          ctx.arc(x, y, 2.5, 0, 2 * Math.PI);
          ctx.fillStyle = '#10B981';
          ctx.fill();
        }

        if (landmarks[473]) {
          const pt = landmarks[473];
          const x = (1 - pt.x) * width;
          const y = pt.y * height;
          ctx.beginPath();
          ctx.arc(x, y, 2.5, 0, 2 * Math.PI);
          ctx.fillStyle = '#10B981';
          ctx.fill();
        }
      },

      clear: () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      },
    }));

    return (
      <canvas
        ref={canvasRef}
        className={className || 'absolute inset-0 w-full h-full pointer-events-none z-10'}
      />
    );
  }
);

FaceLandmarkOverlay.displayName = 'FaceLandmarkOverlay';
