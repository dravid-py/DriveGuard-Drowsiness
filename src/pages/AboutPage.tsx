import React from 'react';
import { ShieldCheck, AlertCircle, ArrowRight, Cpu, Layers, BookOpen, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const AboutPage: React.FC = () => {
  const architectureSteps = [
    { name: 'Webcam', desc: 'Captures local video stream inside your client browser.' },
    { name: 'Face Landmarks', desc: 'Calculates 3D facial mesh points locally on device.' },
    { name: 'Eye Analysis', desc: 'Computes Eye Aspect Ratio (EAR) and blink dynamics.' },
    { name: 'Drowsiness Engine', desc: 'Evaluates duration of closure against sensitivity threshold.' },
    { name: 'Alert Engine', desc: 'Triggers visual cues and audio alert prompts.' },
    { name: 'Session Report', desc: 'Generates on-device session summary metrics.' },
  ];

  const limitations = [
    'Ambient lighting: Extreme darkness or intense backlight can degrade landmark detection accuracy.',
    'Camera positioning: The webcam should be directly in front of you at eye or upper screen level.',
    'Eyewear & Occlusion: Heavy tinted glasses, thick frames, or hands covering the face can obscure eye landmarks.',
    'Head Visibility: Your face must remain sufficiently visible within the webcam frame.',
    'Statistical Estimation: Computer-vision algorithms may produce occasional false positives or misses.',
    'Awareness Only: DriveGuard is an assistance tool; it is not a medical device and never replaces proper sleep, rest, and ergonomics.',
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge variant="brand" size="md">
          Technical Overview
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          How DriveGuard Works
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          DriveGuard uses browser-based computer vision to analyze facial landmarks and eye-related visual indicators during long computer sessions.
        </p>
      </div>

      {/* Primary Purpose Card */}
      <Card variant="elevated" className="border-surface-border p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Built for Long Screen Sessions</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              DriveGuard is specifically created for students studying late, software developers debugging for hours, and professionals in demanding computer workstation environments. It serves as a gentle vigilance companion to keep your focus sharp.
            </p>
          </div>

          <Link to="/camera" className="shrink-0">
            <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Start Monitoring
            </Button>
          </Link>
        </div>
      </Card>

      {/* System Pipeline / Architecture */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl font-bold text-white">Pipeline Architecture</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {architectureSteps.map((step, idx) => (
            <Card key={step.name} variant="default" className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-emerald-400">0{idx + 1}</span>
                  <Cpu className="w-4 h-4 text-slate-500" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5">{step.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Privacy Architecture Section */}
      <div id="privacy" className="scroll-mt-20">
        <Card variant="elevated" className="border-emerald-900/50 bg-gradient-to-br from-surface-card to-emerald-950/20 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
            <h2 className="text-xl font-bold text-white">Privacy Guarantee</h2>
          </div>

          <div className="space-y-2 text-sm text-slate-200">
            <p className="font-semibold text-emerald-300">
              Video frames are processed locally in your browser.
            </p>
            <p className="text-slate-300">
              No camera video is uploaded to a server.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed pt-1">
              DriveGuard uses client-side WebAssembly and GPU acceleration to run vision models directly in your browser tab. Your camera stream is analyzed in memory per frame and immediately discarded.
            </p>
          </div>
        </Card>
      </div>

      {/* Target Audiences & Modes */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Focus Profiles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card variant="default" className="p-5">
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <BookOpen className="w-5 h-5" />
              <h3 className="font-bold text-white text-base">STUDY MODE</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Geared toward students during long study sessions, online lecture viewing, textbook analysis, and late-night test revision.
            </p>
          </Card>

          <Card variant="default" className="p-5">
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
              <Briefcase className="w-5 h-5" />
              <h3 className="font-bold text-white text-base">WORK MODE</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Designed for employees, software engineers, data analysts, and remote knowledge workers on multi-hour workstation tasks.
            </p>
          </Card>
        </div>
      </div>

      {/* System Limitations */}
      <div id="limitations" className="space-y-4 scroll-mt-20">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-400" />
          <h2 className="text-xl font-bold text-white">System Limitations & Guidelines</h2>
        </div>

        <Card variant="default" className="p-6">
          <ul className="space-y-3 text-xs text-slate-300">
            {limitations.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Ready to start CTA */}
      <div className="text-center pt-4">
        <Link to="/camera">
          <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Start Monitoring Now
          </Button>
        </Link>
      </div>
    </div>
  );
};
