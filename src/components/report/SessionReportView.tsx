import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  History,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Briefcase,
  Activity,
  ShieldCheck,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { getLatestCompletedSession } from '../../lib/session/sessionManager';
import { formatTime } from '../../lib/utils';
import type { UserSession } from '../../lib/session/sessionTypes';

export const SessionReportView: React.FC = () => {
  const navigate = useNavigate();
  const [session] = useState<UserSession | null>(() => getLatestCompletedSession());

  const formatEventTime = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const durationSec = session ? Math.round(session.durationMs / 1000) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              SESSION COMPLETE
            </h1>
            {session && (
              <Badge variant="brand" size="sm">
                {session.mode === 'study' ? (
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-emerald-400" /> Study Mode
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-indigo-400" /> Work Mode
                  </span>
                )}
              </Badge>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            {session
              ? `Real-time summary and attention indicators recorded at ${new Date(session.startedAt).toLocaleDateString()} ${new Date(session.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`
              : 'Summary and visual attention indicators from your computer session.'}
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<RotateCcw className="w-4 h-4" />}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          onClick={() => navigate('/camera')}
        >
          Start New Session
        </Button>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Monitoring Duration */}
        <Card variant="default" className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Duration</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono-num mb-1">
            {formatTime(durationSec)}
          </div>
          <p className="text-[11px] text-slate-400">Monitoring Duration</p>
        </Card>

        {/* Alerts Triggered */}
        <Card variant="default" className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono-num mb-1">
            {session ? session.alertCount : 0}
          </div>
          <p className="text-[11px] text-slate-400">Alerts Triggered</p>
        </Card>

        {/* Long Eye Closures */}
        <Card variant="default" className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Eye Closures</span>
            <Eye className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono-num mb-1">
            {session ? session.longEyeClosureCount : 0}
          </div>
          <p className="text-[11px] text-slate-400">Long Eye Closures</p>
        </Card>

        {/* Possible Drowsiness Events */}
        <Card variant="default" className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Events</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono-num mb-1">
            {session ? session.drowsinessEventCount : 0}
          </div>
          <p className="text-[11px] text-slate-400">Possible Drowsiness Events</p>
        </Card>
      </div>

      {/* Analytics & Timeline Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Timeline Section */}
        <Card variant="default" className="lg:col-span-7 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-slate-400" />
              Session Timeline
            </h2>
            {session && session.events.length > 0 ? (
              <Badge variant="normal" size="sm">
                {session.events.length} Events
              </Badge>
            ) : (
              <Badge variant="muted" size="sm">Empty</Badge>
            )}
          </div>

          {session && session.events.length > 0 ? (
            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {session.events.map((event) => {
                const isAlert =
                  event.type === 'DROWSINESS_DETECTED' || event.type === 'DROWSINESS_WARNING';
                const isClosure = event.type === 'LONG_EYE_CLOSURE';
                const isAck = event.type === 'ALERT_ACKNOWLEDGED';

                return (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-surface-muted border border-surface-border text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isAlert
                            ? 'bg-rose-500'
                            : isClosure
                            ? 'bg-amber-500'
                            : isAck
                            ? 'bg-emerald-500'
                            : 'bg-slate-400'
                        }`}
                      />
                      <span className="font-medium text-slate-200">{event.label}</span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-400">
                      {formatEventTime(event.timestamp)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="border border-dashed border-surface-border rounded-xl p-8 text-center flex flex-col items-center justify-center min-h-[220px]">
              <History className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-sm font-medium text-slate-300">NO SESSION DATA</p>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                Complete a monitoring session to see your results recorded chronologically.
              </p>
            </div>
          )}
        </Card>

        {/* Session Focus & Compliance Summary */}
        <Card variant="default" className="lg:col-span-5 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Session Focus Summary
              </h2>
              <Badge variant="brand" size="sm">Local Analytics</Badge>
            </div>

            {session ? (
              <div className="space-y-3.5 text-xs">
                <div className="p-3 rounded-lg bg-surface-muted border border-surface-border flex items-center justify-between">
                  <span className="text-slate-400">Profile</span>
                  <span className="font-bold text-white uppercase">{session.mode} MODE</span>
                </div>
                <div className="p-3 rounded-lg bg-surface-muted border border-surface-border flex items-center justify-between">
                  <span className="text-slate-400">Total Duration</span>
                  <span className="font-bold text-emerald-400 font-mono-num">{formatTime(durationSec)}</span>
                </div>
                <div className="p-3 rounded-lg bg-surface-muted border border-surface-border flex items-center justify-between">
                  <span className="text-slate-400">Fatigue Flag Rate</span>
                  <span className="font-bold text-slate-200 font-mono-num">
                    {durationSec > 60
                      ? `${((session.drowsinessEventCount / (durationSec / 60)) || 0).toFixed(1)} / hr`
                      : `${session.drowsinessEventCount} total`}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
                  {session.drowsinessEventCount === 0
                    ? 'Excellent focus consistency maintained throughout this session.'
                    : 'Fatigue indicators were flagged. Remember to take regular ergonomic breaks.'}
                </p>
              </div>
            ) : (
              <div className="border border-dashed border-surface-border rounded-xl p-8 text-center flex flex-col items-center justify-center min-h-[180px]">
                <Activity className="w-8 h-8 text-slate-600 mb-2" />
                <p className="text-sm font-medium text-slate-300">No session metrics yet.</p>
                <p className="text-xs text-slate-500 max-w-xs mt-1">
                  Start a monitoring session to calculate vigilance trends.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-surface-border/60 flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Session history is stored locally in your browser storage.</span>
          </div>
        </Card>
      </div>

      {/* Positioning Guidance Box */}
      <div className="p-4 rounded-xl bg-surface-card border border-surface-border text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="font-semibold text-slate-200">Study & Work Session Tracking:</span> All metrics are calculated locally inside your browser and reset when starting a new session.
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="shrink-0"
          onClick={() => navigate('/camera')}
        >
          Start New Session
        </Button>
      </div>
    </div>
  );
};
