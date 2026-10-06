import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, Coffee, Square, Shield } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { stopAlertAudio } from '../../lib/alerts/audioAlert';

export const AlertOverlay: React.FC = () => {
  const navigate = useNavigate();

  const handleAwake = () => {
    stopAlertAudio();
    navigate('/monitor');
  };

  const handleTakeBreak = () => {
    stopAlertAudio();
    navigate('/report');
  };

  const handleStop = () => {
    stopAlertAudio();
    navigate('/report');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      {/* Amber/Red Ambient glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <Card
        variant="elevated"
        className="max-w-xl w-full border-amber-500/50 bg-gradient-to-b from-surface-card via-surface-card to-amber-950/20 p-6 sm:p-10 shadow-2xl text-center space-y-6"
      >
        {/* Pulsing Warning Icon */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-amber-950/80 border-2 border-amber-500/70 flex items-center justify-center text-amber-400 animate-pulse">
            <AlertTriangle className="w-10 h-10" />
          </div>
        </div>

        {/* Headline & Guidance */}
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-950 border border-amber-800 text-amber-400 text-xs font-bold uppercase tracking-wider">
            Visual Alert Prompt
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            DROWSINESS DETECTED
          </h1>
          <p className="text-base sm:text-lg text-slate-200 font-medium">
            Please take a moment to regain alertness.
          </p>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed pt-1">
            Visual indicators associated with prolonged eye closure were flagged. Blink gently, adjust your posture, or step away for a brief rest.
          </p>
        </div>

        {/* Action Controls */}
        <div className="space-y-3 pt-4 border-t border-surface-border/60">
          <Button
            variant="primary"
            size="lg"
            className="w-full bg-emerald-600 hover:bg-emerald-500 border-emerald-500/40"
            leftIcon={<CheckCircle2 className="w-5 h-5" />}
            onClick={handleAwake}
          >
            I&apos;m Awake
          </Button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              onClick={handleStop}
            >
              Stop Monitoring
            </Button>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <Shield className="w-3.5 h-3.5 text-slate-500" />
          <span>Local browser detection • DriveGuard Real-Time Awareness Engine</span>
        </div>
      </Card>
    </div>
  );
};
