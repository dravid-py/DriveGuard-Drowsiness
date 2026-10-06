import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Sparkles, BookOpen, Briefcase } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Background ambient radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-950/20 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Privacy Pill Badge */}
        <div className="inline-flex items-center gap-2 mb-6">
          <Badge variant="normal" size="md" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
            PRIVATE BY DESIGN
          </Badge>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Your camera stays on your device. Video is never uploaded.
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
          Stay Awake. <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
            Stay Focused.
          </span>
        </h1>

        {/* Supporting text */}
        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Real-time drowsiness awareness for students and professionals during long computer sessions.
        </p>

        {/* Dual Mode Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-card border border-surface-border">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <strong className="text-slate-200">Study Mode:</strong> Exam & study session awareness
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-card border border-surface-border">
            <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
            <strong className="text-slate-200">Work Mode:</strong> Deep focus for coding & computer work
          </span>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <Link to="/camera" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto shadow-lg shadow-emerald-950/50"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Start Monitoring
            </Button>
          </Link>
          <Link to="/about" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              How It Works
            </Button>
          </Link>
        </div>

        {/* Sub-note */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400/70" />
          <span>Zero installation needed • Runs 100% in your browser • Free & open tool</span>
        </div>
      </div>
    </section>
  );
};
