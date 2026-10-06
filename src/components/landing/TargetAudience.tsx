import React from 'react';
import { GraduationCap, Briefcase, Code, MonitorPlay } from 'lucide-react';
import { Card } from '../ui/Card';

export const TargetAudience: React.FC = () => {
  const personas = [
    {
      role: 'Student',
      icon: <GraduationCap className="w-5 h-5 text-emerald-400" />,
      tagline: 'Study for long sessions while staying alert.',
      scenario: 'Late-night revision, exam preparation, and heavy textbook reading sessions.',
    },
    {
      role: 'Professional',
      icon: <Briefcase className="w-5 h-5 text-sky-400" />,
      tagline: 'Work long hours with awareness of fatigue indicators.',
      scenario: 'Extended spreadsheet analysis, report writing, and daily administrative tasks.',
    },
    {
      role: 'Developer',
      icon: <Code className="w-5 h-5 text-indigo-400" />,
      tagline: 'Stay alert during extended coding sessions.',
      scenario: 'Deep debugging sprints, architecture design, and multi-hour programming marathons.',
    },
    {
      role: 'Online Learner',
      icon: <MonitorPlay className="w-5 h-5 text-amber-400" />,
      tagline: 'Maintain awareness during long online learning sessions.',
      scenario: 'Virtual classrooms, webinars, certification video courses, and remote lectures.',
    },
  ];

  return (
    <section className="py-16 md:py-24 border-t border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-2">
            Target Audience
          </h2>
          <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            WHO IS IT FOR?
          </p>
          <p className="text-sm text-slate-400 mt-2">
            Designed for anyone spending prolonged hours in front of a desktop monitor or laptop.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {personas.map((persona) => (
            <Card
              key={persona.role}
              variant="interactive"
              className="flex flex-col justify-between group hover:border-slate-500 transition-all duration-200"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-surface-elevated border border-surface-border flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  {persona.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-1.5">
                  {persona.role}
                </h3>
                <p className="text-xs font-medium text-slate-300 mb-3">
                  {persona.tagline}
                </p>
              </div>
              <p className="text-[11px] text-slate-400 border-t border-surface-border/60 pt-3">
                {persona.scenario}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
