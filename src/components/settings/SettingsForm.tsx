import React, { useState } from 'react';
import { Sliders, Volume2, ShieldCheck, RotateCcw, Save, Check, BookOpen, Briefcase } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Toggle } from '../ui/Toggle';
import { Badge } from '../ui/Badge';
import type { AppSettings, SensitivityLevel, UserMode } from '../../types';
import { loadSettings, saveSettings, resetSettings } from '../../lib/storage/settingsStorage';

export const SettingsForm: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSensitivityChange = (level: SensitivityLevel) => {
    setSettings((prev) => ({ ...prev, drowsinessSensitivity: level }));
  };

  const handleModeChange = (mode: UserMode) => {
    setSettings((prev) => ({ ...prev, mode }));
  };

  const handleSave = () => {
    saveSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleReset = () => {
    const defaults = resetSettings();
    setSettings(defaults);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Settings & Preferences
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Tune detection sensitivity, alert thresholds, and session modes for your computer workflow.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RotateCcw className="w-4 h-4" />}
            onClick={handleReset}
          >
            Reset to Default
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            onClick={handleSave}
          >
            {savedSuccess ? 'Saved' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-150">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Preferences updated and saved to local browser storage.</span>
        </div>
      )}

      {/* Mode Selection (Study Mode vs Work Mode) */}
      <Card variant="default">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Operating Mode
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select the context best matching your current computer activity.
            </p>
          </div>
          <Badge variant="brand" size="sm">Focus Profile</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Study Mode */}
          <button
            type="button"
            onClick={() => handleModeChange('study')}
            className={`p-4 rounded-xl border text-left transition-all ${
              settings.mode === 'study'
                ? 'bg-emerald-950/40 border-emerald-500/80 shadow-glow-green ring-1 ring-emerald-500/40'
                : 'bg-surface-muted border-surface-border hover:border-slate-600'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <BookOpen className={`w-4 h-4 ${settings.mode === 'study' ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className="text-sm font-bold text-white">STUDY MODE</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tailored for students during prolonged reading, textbook review, and exam prep.
            </p>
          </button>

          {/* Work Mode */}
          <button
            type="button"
            onClick={() => handleModeChange('work')}
            className={`p-4 rounded-xl border text-left transition-all ${
              settings.mode === 'work'
                ? 'bg-indigo-950/40 border-indigo-500/80 ring-1 ring-indigo-500/40'
                : 'bg-surface-muted border-surface-border hover:border-slate-600'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Briefcase className={`w-4 h-4 ${settings.mode === 'work' ? 'text-indigo-400' : 'text-slate-400'}`} />
              <span className="text-sm font-bold text-white">WORK MODE</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Optimized for software developers, professionals, and long computer workstation shifts.
            </p>
          </button>
        </div>
      </Card>

      {/* Drowsiness Sensitivity */}
      <Card variant="default" className="space-y-4">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
            Drowsiness Sensitivity
          </h2>
          <p className="text-xs text-slate-400">
            Controls how quickly prolonged eye closure prompts are triggered.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-1">
          {(['low', 'medium', 'high'] as SensitivityLevel[]).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => handleSensitivityChange(level)}
              className={`py-3 px-4 rounded-xl border font-medium text-xs uppercase tracking-wider text-center transition-all ${
                settings.drowsinessSensitivity === level
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                  : 'bg-surface-muted text-slate-300 border-surface-border hover:border-slate-600'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </Card>

      {/* Threshold & Timing Settings */}
      <Card variant="default" className="space-y-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          Detection & Threshold Adjustments
        </h2>

        {/* Eye Closure Threshold Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="eyeClosureThreshold" className="font-semibold text-slate-200">
              Eye Closure Threshold
            </label>
            <span className="font-mono font-bold text-emerald-400">
              {settings.eyeClosureThreshold.toFixed(1)}s
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Consecutive seconds of closed eyes before triggering an alert state.
          </p>
          <input
            id="eyeClosureThreshold"
            type="range"
            min="1.0"
            max="4.0"
            step="0.1"
            value={settings.eyeClosureThreshold}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, eyeClosureThreshold: parseFloat(e.target.value) }))
            }
            className="w-full accent-emerald-500 bg-surface-muted h-2 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>1.0s (Fast)</span>
            <span>2.0s (Standard)</span>
            <span>4.0s (Relaxed)</span>
          </div>
        </div>

        {/* Alert Volume */}
        <div className="space-y-2 pt-2 border-t border-surface-border">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="alertVolume" className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-slate-400" />
              Alert Volume
            </label>
            <span className="font-mono font-bold text-emerald-400">
              {settings.alertVolume}%
            </span>
          </div>
          <input
            id="alertVolume"
            type="range"
            min="0"
            max="100"
            step="5"
            value={settings.alertVolume}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, alertVolume: parseInt(e.target.value, 10) }))
            }
            className="w-full accent-emerald-500 bg-surface-muted h-2 rounded-lg cursor-pointer"
          />
        </div>

        {/* Alert Duration */}
        <div className="space-y-2 pt-2 border-t border-surface-border">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="alertDuration" className="font-semibold text-slate-200">
              Alert Duration
            </label>
            <span className="font-mono font-bold text-emerald-400">
              {settings.alertDuration}s
            </span>
          </div>
          <input
            id="alertDuration"
            type="range"
            min="1"
            max="10"
            step="1"
            value={settings.alertDuration}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, alertDuration: parseInt(e.target.value, 10) }))
            }
            className="w-full accent-emerald-500 bg-surface-muted h-2 rounded-lg cursor-pointer"
          />
        </div>

        {/* Break Reminder */}
        <div className="space-y-2 pt-2 border-t border-surface-border">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="breakReminder" className="font-semibold text-slate-200">
              Break Reminder Interval
            </label>
            <span className="font-mono font-bold text-emerald-400">
              {settings.breakReminderMinutes === 0 ? 'Disabled' : `Every ${settings.breakReminderMinutes} mins`}
            </span>
          </div>
          <select
            id="breakReminder"
            value={settings.breakReminderMinutes}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, breakReminderMinutes: parseInt(e.target.value, 10) }))
            }
            className="w-full p-2.5 rounded-lg bg-surface-muted border border-surface-border text-xs text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <option value="0">Disabled (No periodic break prompt)</option>
            <option value="20">20 minutes (20-20-20 Rule for eye strain)</option>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes (Recommended for study sessions)</option>
            <option value="60">60 minutes</option>
          </select>
        </div>
      </Card>

      {/* Alert Type Toggles */}
      <Card variant="default" className="space-y-2 divide-y divide-surface-border/60">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider pb-2">
          Alert Types & Display Options
        </h2>

        <Toggle
          label="Visual Alert"
          description="Display screen overlay cues and status color changes when drowsiness is detected."
          checked={settings.enableVisualAlert}
          onChange={(val) => setSettings((prev) => ({ ...prev, enableVisualAlert: val }))}
        />

        <Toggle
          label="Audio Alert"
          description="Play a gentle sound chime upon prolonged eye closure detection."
          checked={settings.enableAudioAlert}
          onChange={(val) => setSettings((prev) => ({ ...prev, enableAudioAlert: val }))}
        />

        <Toggle
          label="Face Detection Indicator"
          description="Show face alignment indicators in the monitoring feed canvas."
          checked={settings.showFaceLandmarkIndicator}
          onChange={(val) => setSettings((prev) => ({ ...prev, showFaceLandmarkIndicator: val }))}
        />
      </Card>

      {/* Privacy Information Box */}
      <Card variant="default" className="border-emerald-900/40 bg-surface-muted/60 p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <h3 className="font-bold text-white">Privacy Information</h3>
            <p className="text-slate-300">
              Your preferences and configurations are stored solely in your browser local storage.
            </p>
            <p className="text-slate-400">
              DriveGuard never uploads webcam images, facial coordinates, or setting parameters to external servers.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
