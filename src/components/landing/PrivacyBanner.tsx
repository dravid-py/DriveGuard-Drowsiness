import React from 'react';
import { ShieldCheck, Lock, EyeOff, ServerOff } from 'lucide-react';
import { Card } from '../ui/Card';

export const PrivacyBanner: React.FC = () => {
  const privacyPillars = [
    {
      icon: <Lock className="w-4 h-4 text-emerald-400" />,
      title: 'Local Browser Processing',
      desc: 'Computer vision computations occur strictly inside your local client environment.',
    },
    {
      icon: <ServerOff className="w-4 h-4 text-emerald-400" />,
      title: 'No Server Ingestion',
      desc: 'There is no backend server receiving your webcam feed. Zero frames leave your machine.',
    },
    {
      icon: <EyeOff className="w-4 h-4 text-emerald-400" />,
      title: 'No Recordings Stored',
      desc: 'Video frames are analyzed frame-by-frame and immediately discarded from memory.',
    },
  ];

  return (
    <section className="py-16 md:py-20 border-t border-surface-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card variant="elevated" className="border-emerald-900/40 bg-gradient-to-br from-surface-card to-emerald-950/20 p-8 md:p-12 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Headline */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                Privacy First Design
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                YOUR CAMERA.<br />
                YOUR DEVICE.<br />
                <span className="text-emerald-400">YOUR DATA.</span>
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-lg">
                DriveGuard is designed around local browser processing. Camera video is not uploaded to any remote server, ever.
              </p>
            </div>

            {/* Pillars */}
            <div className="lg:col-span-6 space-y-3.5">
              {privacyPillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="flex items-start gap-3.5 p-3.5 rounded-lg bg-surface-muted/70 border border-surface-border"
                >
                  <div className="w-8 h-8 rounded-md bg-emerald-950/80 border border-emerald-800/40 flex items-center justify-center shrink-0 mt-0.5">
                    {pillar.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white mb-0.5">{pillar.title}</h4>
                    <p className="text-xs text-slate-400 leading-normal">{pillar.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
