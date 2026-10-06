import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ShieldCheck, ArrowLeft, CheckCircle2, AlertCircle, Loader2, RotateCcw, AlertTriangle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { requestCameraStream, stopCameraStream, parseCameraError } from '../../lib/camera/cameraService';
import type { CameraErrorDetail } from '../../types/vision';

export const CameraSetupCard: React.FC = () => {
  const navigate = useNavigate();
  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<CameraErrorDetail | null>(null);

  const handleAllowCamera = async () => {
    setIsRequesting(true);
    setCameraError(null);

    try {
      // Real camera permission request initiated strictly on user button action
      const stream = await requestCameraStream();
      // Clean up the initial handshake stream before transitioning to the active monitor view
      stopCameraStream(stream);

      // Successfully granted -> Navigate to /monitor
      navigate('/monitor');
    } catch (err) {
      console.warn('Camera permission request error:', err);
      const parsed = parseCameraError(err);
      setCameraError(parsed);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16">
      <Card variant="elevated" className="border-surface-border p-6 sm:p-10">
        <div className="text-center space-y-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
            <Camera className="w-8 h-8" />
          </div>

          <div>
            <Badge variant="normal" size="sm" className="mb-2">
              Permission Setup
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Camera Access Required
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
              DriveGuard uses your webcam to analyze facial landmarks locally in your browser.
            </p>
          </div>
        </div>

        {/* Error Notification Banner if Permission Denied or Device Unavailable */}
        {cameraError && (
          <div className="p-4 rounded-xl bg-rose-950/70 border border-rose-500/50 mb-6 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-rose-300 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              {cameraError.title}
            </div>
            <p className="text-xs text-rose-200 leading-relaxed">
              {cameraError.message}
            </p>
            <p className="text-[11px] text-slate-300 border-t border-rose-900/60 pt-2">
              <strong>Recommendation:</strong> {cameraError.advice}
            </p>
          </div>
        )}

        {/* Privacy Note Box */}
        <div className="p-4 rounded-xl bg-surface-muted border border-emerald-900/50 mb-8 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold text-emerald-300 mb-1">
              Your video never leaves this device.
            </p>
            <p className="text-slate-400 leading-relaxed">
              Video is processed locally in your browser and is not uploaded by DriveGuard. Frames are analyzed in real time and immediately discarded.
            </p>
          </div>
        </div>

        {/* Optimal Setup Recommendations */}
        <div className="space-y-3 mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Optimal Setup Recommendations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300">
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-muted/60 border border-surface-border">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Face positioned centered to webcam</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-muted/60 border border-surface-border">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Adequate, balanced front lighting</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-muted/60 border border-surface-border">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Avoid strong backlight or glare</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-muted/60 border border-surface-border">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Keep eyes and face unobscured</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            variant="secondary"
            size="md"
            className="w-full sm:w-1/3 order-2 sm:order-1"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={handleBack}
            disabled={isRequesting}
          >
            Back
          </Button>

          {cameraError ? (
            <Button
              variant="primary"
              size="md"
              className="w-full sm:w-2/3 order-1 sm:order-2"
              leftIcon={<RotateCcw className="w-4 h-4" />}
              onClick={handleAllowCamera}
              disabled={isRequesting}
            >
              {isRequesting ? 'Requesting Access...' : 'Try Again'}
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              className="w-full sm:w-2/3 order-1 sm:order-2"
              leftIcon={isRequesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
              onClick={handleAllowCamera}
              disabled={isRequesting}
            >
              {isRequesting ? 'Requesting Access...' : 'Allow Camera'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
