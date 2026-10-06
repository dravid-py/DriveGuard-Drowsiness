import React from 'react';
import { Camera, ScanFace, Eye, Activity, BellRing, ArrowRight } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const HowItWorksFlow: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Camera',
      icon: <Camera className="w-5 h-5 text-emerald-400" />,
      desc: 'Accesses your local computer webcam through your browser without storing frames.',
    },
    {
      step: '02',
      title: 'Face Detection',
      icon: <ScanFace className="w-5 h-5 text-teal-400" />,
      desc: 'Detects facial landmarks directly on your device CPU/GPU in real time.',
    },
    {
      step: '03',
      title: 'Eye Analysis',
      icon: <Eye className="w-5 h-5 text-sky-400" />,
      desc: 'Computes eye openness metrics to monitor blink rates and closure duration.',
    },
    {
      step: '04',
      title: 'Drowsiness Engine',
      icon: <Activity className="w-5 h-5 text-amber-400" />,
      desc: 'Evaluates prolonged eye closure patterns against configurable sensitivity thresholds.',
    },
    {
      step: '05',
      title: 'Alert System',
      icon: <BellRing className="w-5 h-5 text-rose-400" />,
      desc: 'Triggers visual cues and audio prompts to help you regain focus or take a rest.',
    },
  ];

  return (
    <section className="py-16 md:py-24 border-t border-surface-border bg-surface-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="brand" size="sm" className="mb-2">
            System Architecture
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            How DriveGuard Works
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            A 5-stage real-time pipeline operating 100% locally inside your web browser.
          </p>
        </div>

        {/* Steps Grid / Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {steps.map((item, idx) => (
            <div
              key={item.title}
              className="relative p-5 rounded-xl bg-surface-card border border-surface-border flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold text-slate-500">{item.step}</span>
                  <div className="w-8 h-8 rounded-lg bg-surface-elevated border border-surface-border flex items-center justify-center">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <div className="w-6 h-6 rounded-full bg-surface-elevated border border-surface-border flex items-center justify-center text-slate-400">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Foundation Notice */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-500 max-w-xl mx-auto">
            Note: MASTER 1 establishes the product architecture and UI foundation. Local camera pipeline and computer-vision models are integrated in upcoming phases.
          </p>
        </div>
      </div>
    </section>
  );
};
