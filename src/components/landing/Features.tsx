import React from 'react';
import { Eye, BellRing, Lock } from 'lucide-react';
import { Card } from '../ui/Card';

export const Features: React.FC = () => {
  const features = [
    {
      icon: <Eye className="w-6 h-6 text-emerald-400" />,
      title: 'REAL-TIME MONITORING',
      description: 'Monitor visual indicators associated with drowsiness during long PC sessions.',
      detail: 'Analyzes eye closure intervals and head attentiveness without sending data off your machine.',
    },
    {
      icon: <BellRing className="w-6 h-6 text-amber-400" />,
      title: 'INSTANT ALERTS',
      description: 'Receive timely visual and audio alerts when prolonged eye closure is detected.',
      detail: 'Configurable audio chime and full-screen visual cues prompt you to re-orient or take a break.',
    },
    {
      icon: <Lock className="w-6 h-6 text-indigo-400" />,
      title: 'PRIVACY FIRST',
      description: 'Camera processing is designed to stay on your device.',
      detail: 'No video stream is saved, recorded, or transmitted to any external server or cloud service.',
    },
  ];

  return (
    <section className="py-16 md:py-24 border-t border-surface-border/80 bg-surface-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-2">
            Core Capabilities
          </h2>
          <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Engineered for long, intensive screen sessions
          </p>
          <p className="text-sm text-slate-400 mt-3">
            A non-intrusive desktop companion for focused study and high-concentration work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature) => (
            <Card key={feature.title} variant="default" className="flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-surface-elevated border border-surface-border flex items-center justify-center mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-base font-bold tracking-wide text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm font-medium text-slate-200 mb-3">
                  {feature.description}
                </p>
              </div>
              <p className="text-xs text-slate-400 border-t border-surface-border/60 pt-3 mt-2 leading-relaxed">
                {feature.detail}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
