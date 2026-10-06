import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Activity,
  Eye,
  ShieldAlert,
  Sliders,
  Play,
  Square,
  AlertCircle,
  EyeOff,
  BookOpen,
  Briefcase,
  AlertTriangle,
  CheckCircle2,
  Coffee,
  ShieldCheck,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { StatusDot } from '../ui/StatusDot';
import { WebcamFeed } from '../camera/WebcamFeed';
import { DrowsinessEngine } from '../../lib/drowsiness/drowsinessEngine';
import { buildDrowsinessConfig } from '../../lib/drowsiness/drowsinessConfig';
import type { DrowsinessState, EyeState } from '../../lib/drowsiness/drowsinessTypes';
import { playAlertChime, stopAlertAudio } from '../../lib/alerts/audioAlert';
import {
  startSession,
  recordSessionEvent,
  endActiveSession,
} from '../../lib/session/sessionManager';
import { loadSettings } from '../../lib/storage/settingsStorage';
import { formatTime } from '../../lib/utils';
import type { CameraErrorDetail, NormalizedLandmark } from '../../types/vision';
import type { AppSettings, UserMode } from '../../types';

export const LiveMonitoringPanel: React.FC = () => {
  const navigate = useNavigate();

  // Settings & Configuration
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [currentMode, setCurrentMode] = useState<UserMode>(settings.mode || 'study');
  const drowsinessConfig = useRef(buildDrowsinessConfig({ ...settings, mode: currentMode }));

  // Monitoring States
  const [isMonitoringActive, setIsMonitoringActive] = useState<boolean>(true);
  const [isFaceDetected, setIsFaceDetected] = useState<boolean>(false);
  const [showOverlay, setShowOverlay] = useState<boolean>(settings.showFaceLandmarkIndicator ?? true);
  const [cameraError, setCameraError] = useState<CameraErrorDetail | null>(null);

  // Drowsiness & Eye Status
  const [drowsinessState, setDrowsinessState] = useState<DrowsinessState>('UNKNOWN');
  const [eyeState, setEyeState] = useState<EyeState>('UNKNOWN');
  const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);

  // Real Session Stats
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [alertCount, setAlertCount] = useState<number>(0);
  const [longEyeClosureCount, setLongEyeClosureCount] = useState<number>(0);
  const [drowsinessEventCount, setDrowsinessEventCount] = useState<number>(0);

  // Drowsiness Engine instance
  const engineRef = useRef<DrowsinessEngine>(new DrowsinessEngine(5));

  // Sync settings updates
  useEffect(() => {
    const loaded = loadSettings();
    setSettings(loaded);
    drowsinessConfig.current = buildDrowsinessConfig({ ...loaded, mode: currentMode });
  }, [currentMode]);

  // Session timer lifecycle
  useEffect(() => {
    let timerId: number | null = null;
    if (isMonitoringActive && !cameraError) {
      // Start session in sessionManager
      startSession(currentMode);
      setElapsedSeconds(0);
      setAlertCount(0);
      setLongEyeClosureCount(0);
      setDrowsinessEventCount(0);

      timerId = window.setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerId !== null) {
        clearInterval(timerId);
      }
    };
  }, [isMonitoringActive, cameraError, currentMode]);

  // Tab visibility safety listener
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pause active closure timer to avoid false positive alarms while tab is in background
        engineRef.current.reset();
        stopAlertAudio();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAlertAudio();
      engineRef.current.reset();
    };
  }, []);

  // Real-time landmark processing pipeline
  const handleLandmarksProcessed = useCallback(
    (landmarks: NormalizedLandmark[] | undefined, timestamp: number) => {
      if (!isMonitoringActive || document.hidden) return;

      const evalResult = engineRef.current.processFrame(
        landmarks,
        timestamp,
        drowsinessConfig.current
      );

      setDrowsinessState(evalResult.state);
      setEyeState(evalResult.eyeState);

      // Handle recorded events
      if (evalResult.eventTriggered) {
        recordSessionEvent(evalResult.eventTriggered);

        if (evalResult.eventTriggered === 'LONG_EYE_CLOSURE') {
          setLongEyeClosureCount((prev) => prev + 1);
        } else if (evalResult.eventTriggered === 'DROWSINESS_DETECTED') {
          setDrowsinessEventCount((prev) => prev + 1);
          setAlertCount((prev) => prev + 1);
        }
      }

      // Handle alerts
      if (evalResult.shouldAlert) {
        if (drowsinessConfig.current.enableAudioAlert) {
          playAlertChime(drowsinessConfig.current.alertVolume);
        }
        if (drowsinessConfig.current.enableVisualAlert) {
          setIsAlertModalOpen(true);
        }
      }
    },
    [isMonitoringActive]
  );

  const handleFaceStatusChange = useCallback((detected: boolean) => {
    setIsFaceDetected(detected);
    if (!detected) {
      setDrowsinessState('UNKNOWN');
      setEyeState('UNKNOWN');
      engineRef.current.reset();
    }
  }, []);

  const handleCameraError = useCallback((err: CameraErrorDetail) => {
    setCameraError(err);
  }, []);

  // User Acknowledges Alert ("I'm Awake")
  const handleAcknowledgeAlert = () => {
    stopAlertAudio();
    setIsAlertModalOpen(false);
    engineRef.current.acknowledgeAlert(performance.now(), drowsinessConfig.current.cooldownMs);
    recordSessionEvent('ALERT_ACKNOWLEDGED');
    setDrowsinessState('NORMAL');
  };

  // User takes a break or stops
  const handleTakeBreak = () => {
    stopAlertAudio();
    setIsAlertModalOpen(false);
    setIsMonitoringActive(false);
    endActiveSession();
    navigate('/report');
  };

  const handleStopMonitoring = () => {
    stopAlertAudio();
    setIsAlertModalOpen(false);
    setIsMonitoringActive(false);
    endActiveSession();
    navigate('/report');
  };

  // Status indicators formatting
  const getDrowsinessStatusText = () => {
    if (!isFaceDetected) return 'NOT ANALYZED';
    switch (drowsinessState) {
      case 'DROWSINESS_DETECTED':
        return 'DETECTED';
      case 'DROWSINESS_WARNING':
      case 'EYES_CLOSING':
      case 'EYES_CLOSED':
        return 'CHECKING';
      case 'NORMAL':
        return 'NOT DETECTED';
      default:
        return 'NOT ANALYZED';
    }
  };

  const getDrowsinessStatusColor = () => {
    if (!isFaceDetected) return 'text-slate-400';
    switch (drowsinessState) {
      case 'DROWSINESS_DETECTED':
        return 'text-rose-400 font-bold';
      case 'DROWSINESS_WARNING':
        return 'text-amber-400 font-bold';
      case 'NORMAL':
        return 'text-emerald-400 font-semibold';
      default:
        return 'text-slate-400';
    }
  };

  const getEyeStatusText = () => {
    if (!isFaceDetected) return '--';
    switch (eyeState) {
      case 'OPEN':
        return 'OPEN';
      case 'CLOSING':
        return 'CLOSING';
      case 'CLOSED':
        return 'CLOSED';
      default:
        return '--';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header & System Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              LIVE MONITORING
            </h1>
            <Badge variant="normal" size="sm">
              MASTER 3 ACTIVE
            </Badge>

            {/* Mode Tag */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-card border border-surface-border text-xs">
              {currentMode === 'study' ? (
                <>
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-semibold text-emerald-300">STUDY MODE</span>
                </>
              ) : (
                <>
                  <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="font-semibold text-indigo-300">WORK MODE</span>
                </>
              )}
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time eye openness analysis and drowsiness awareness engine.
          </p>
        </div>

        {/* Global Status Pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-card border border-surface-border text-xs">
            <StatusDot
              status={
                cameraError
                  ? 'critical'
                  : drowsinessState === 'DROWSINESS_DETECTED'
                  ? 'critical'
                  : drowsinessState === 'DROWSINESS_WARNING'
                  ? 'warning'
                  : isFaceDetected
                  ? 'normal'
                  : isMonitoringActive
                  ? 'warning'
                  : 'inactive'
              }
              pulse={isMonitoringActive}
              size="sm"
            />
            <span className="text-slate-400">System Status:</span>
            <span
              className={`font-semibold ${
                cameraError
                  ? 'text-rose-400'
                  : drowsinessState === 'DROWSINESS_DETECTED'
                  ? 'text-rose-400'
                  : drowsinessState === 'DROWSINESS_WARNING'
                  ? 'text-amber-400'
                  : isFaceDetected
                  ? 'text-emerald-400'
                  : isMonitoringActive
                  ? 'text-amber-400'
                  : 'text-slate-400'
              }`}
            >
              {cameraError
                ? 'ERROR'
                : !isMonitoringActive
                ? 'STOPPED'
                : drowsinessState === 'DROWSINESS_DETECTED'
                ? 'DROWSINESS DETECTED'
                : drowsinessState === 'DROWSINESS_WARNING'
                ? 'PROLONGED CLOSURE WARNING'
                : isFaceDetected
                ? 'ATTENTIVE'
                : 'WAITING FOR FACE'}
            </span>
          </div>

          <Link to="/settings">
            <Button variant="outline" size="sm" leftIcon={<Sliders className="w-4 h-4 text-slate-400" />}>
              Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Monitoring Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Center: Live Mirrored Webcam Video Canvas (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <Card
            variant="elevated"
            className="relative p-0 overflow-hidden bg-black border-surface-border flex flex-col aspect-video min-h-[340px] sm:min-h-[440px] justify-between shadow-2xl"
          >
            {isMonitoringActive ? (
              <WebcamFeed
                onFaceStatusChange={handleFaceStatusChange}
                onLandmarksProcessed={handleLandmarksProcessed}
                onCameraError={handleCameraError}
                showOverlay={showOverlay}
              />
            ) : (
              <div className="my-auto flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-surface-card border border-surface-border flex items-center justify-center text-slate-500">
                  <Square className="w-8 h-8 text-slate-400" />
                </div>
                <h2 className="text-lg font-bold text-white">MONITORING STOPPED</h2>
                <p className="text-xs text-slate-400 max-w-sm">
                  Webcam stream and drowsiness analysis have been stopped.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Play className="w-4 h-4" />}
                  onClick={() => setIsMonitoringActive(true)}
                >
                  Resume Monitoring
                </Button>
              </div>
            )}

            {/* Warning Glow / State Banner */}
            {isMonitoringActive && isFaceDetected && drowsinessState === 'DROWSINESS_WARNING' && (
              <div className="absolute top-3 right-3 z-20 animate-pulse">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-950/90 border border-amber-500 text-amber-300 text-xs font-bold shadow-lg">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  EYES CLOSED (CHECKING...)
                </span>
              </div>
            )}

            {/* Face Alignment Guidance Helper Banner when face is absent */}
            {isMonitoringActive && !isFaceDetected && !cameraError && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-[92%] sm:w-auto">
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-amber-950/90 border border-amber-500/60 backdrop-blur-md text-xs text-amber-200 shadow-lg">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Move into the camera frame so DriveGuard can detect your face.</span>
                </div>
              </div>
            )}
          </Card>

          {/* Action Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-surface-card border border-surface-border">
            <div className="flex items-center gap-2">
              {isMonitoringActive ? (
                <Button
                  variant="danger"
                  size="md"
                  leftIcon={<Square className="w-4 h-4" />}
                  onClick={handleStopMonitoring}
                >
                  Stop Monitoring
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<Play className="w-4 h-4" />}
                  onClick={() => setIsMonitoringActive(true)}
                >
                  Start Monitoring
                </Button>
              )}

              <Button
                variant="outline"
                size="md"
                leftIcon={showOverlay ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-emerald-400" />}
                onClick={() => setShowOverlay(!showOverlay)}
              >
                {showOverlay ? 'Hide Landmark Mesh' : 'Show Landmark Mesh'}
              </Button>
            </div>

            {/* Quick Mode Switcher */}
            <div className="flex items-center gap-1.5 bg-surface-muted p-1 rounded-lg border border-surface-border text-xs">
              <button
                type="button"
                onClick={() => setCurrentMode('study')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  currentMode === 'study'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Study
              </button>
              <button
                type="button"
                onClick={() => setCurrentMode('work')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  currentMode === 'work'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Work
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Indicators & Real Session Statistics (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Live Indicators Card */}
          <Card variant="default">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center justify-between">
              <span>Detection Indicators</span>
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
            </h2>

            <div className="space-y-3 text-xs">
              {/* Face Status */}
              <div className="p-3 rounded-lg bg-surface-muted border border-surface-border flex items-center justify-between">
                <span className="text-slate-400 font-medium">Face</span>
                <span
                  className={`font-semibold font-mono-num ${
                    isFaceDetected ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {isFaceDetected ? 'DETECTED' : 'NOT DETECTED'}
                </span>
              </div>

              {/* Eyes Status */}
              <div className="p-3 rounded-lg bg-surface-muted border border-surface-border flex items-center justify-between">
                <span className="text-slate-400 font-medium">Eyes</span>
                <span
                  className={`font-semibold font-mono-num ${
                    eyeState === 'OPEN'
                      ? 'text-emerald-400'
                      : eyeState === 'CLOSED'
                      ? 'text-amber-400'
                      : 'text-slate-400'
                  }`}
                >
                  {getEyeStatusText()}
                </span>
              </div>

              {/* Drowsiness Status */}
              <div className="p-3 rounded-lg bg-surface-muted border border-surface-border flex items-center justify-between">
                <span className="text-slate-400 font-medium">Drowsiness</span>
                <span className={`font-mono-num ${getDrowsinessStatusColor()}`}>
                  {getDrowsinessStatusText()}
                </span>
              </div>
            </div>
          </Card>

          {/* Session Statistics Card */}
          <Card variant="default">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center justify-between">
              <span>Session Statistics</span>
              <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
            </h2>

            <div className="space-y-3">
              {/* Session Duration */}
              <div className="p-3 rounded-lg bg-surface-muted border border-surface-border">
                <div className="text-[11px] text-slate-400 mb-1">Session Duration</div>
                <div className="text-2xl font-extrabold text-white font-mono-num tracking-tight">
                  {formatTime(elapsedSeconds)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Alerts */}
                <div className="p-3 rounded-lg bg-surface-muted border border-surface-border">
                  <div className="text-[11px] text-slate-400 mb-1">Alerts</div>
                  <div className="text-xl font-bold text-white font-mono-num">{alertCount}</div>
                </div>

                {/* Long Eye Closures */}
                <div className="p-3 rounded-lg bg-surface-muted border border-surface-border">
                  <div className="text-[11px] text-slate-400 mb-1">Long Eye Closures</div>
                  <div className="text-xl font-bold text-white font-mono-num">
                    {longEyeClosureCount}
                  </div>
                </div>
              </div>

              {/* Possible Drowsiness Events */}
              <div className="p-3 rounded-lg bg-surface-muted border border-surface-border flex items-center justify-between text-xs">
                <span className="text-slate-400">Drowsiness Events</span>
                <span className="font-bold text-slate-200 font-mono-num">
                  {drowsinessEventCount}
                </span>
              </div>
            </div>
          </Card>

          {/* Privacy Note */}
          <div className="p-3 rounded-lg bg-surface-muted/60 border border-surface-border text-[11px] text-slate-400 leading-relaxed">
            <strong className="text-emerald-400">Privacy Guarantee:</strong> Camera video is processed locally in your browser and is not uploaded by DriveGuard.
          </div>
        </div>
      </div>

      {/* Drowsiness Alert Overlay Modal */}
      {isAlertModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <Card
            variant="elevated"
            className="max-w-md w-full border-rose-500/70 bg-gradient-to-b from-surface-card via-surface-card to-rose-950/30 p-6 sm:p-8 shadow-2xl text-center space-y-6"
          >
            {/* Pulsing Warning Icon */}
            <div className="relative inline-flex items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border-2 border-rose-500/80 flex items-center justify-center text-rose-400 animate-pulse">
                <AlertTriangle className="w-8 h-8" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-0.5 rounded-full bg-rose-950 border border-rose-800 text-rose-300 text-[11px] font-bold uppercase tracking-wider">
                Vigilance Prompt
              </span>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                DROWSINESS DETECTED
              </h2>
              <p className="text-sm text-slate-200 font-medium">
                Please take a moment to regain alertness.
              </p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                Prolonged eye closure was identified during your {currentMode} session.
              </p>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-surface-border/60">
              <Button
                variant="primary"
                size="lg"
                className="w-full bg-emerald-600 hover:bg-emerald-500 border-emerald-500/40"
                leftIcon={<CheckCircle2 className="w-5 h-5" />}
                onClick={handleAcknowledgeAlert}
              >
                I&apos;m Awake
              </Button>

              <div className="grid grid-cols-2 gap-2.5">
                <Button
                  variant="secondary"
                  size="md"
                  leftIcon={<Coffee className="w-4 h-4 text-amber-400" />}
                  onClick={handleTakeBreak}
                >
                  Take a Break
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  leftIcon={<Square className="w-4 h-4 text-rose-400" />}
                  onClick={handleStopMonitoring}
                >
                  Stop Monitoring
                </Button>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>DriveGuard Local Browser Processing</span>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
