import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-surface-border bg-surface-muted/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold tracking-wider text-white text-base">DRIVEGUARD</span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              DriveGuard is a privacy-first browser application that helps students and working professionals stay alert during long computer sessions by detecting visual indicators associated with drowsiness and providing timely alerts.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-900 px-2 py-0.5 rounded">
                <Lock className="w-3 h-3" />
                Local Camera Processing
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-300 bg-surface-elevated border border-surface-border px-2 py-0.5 rounded">
                <Cpu className="w-3 h-3" />
                On-Device Vision
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/camera" className="text-slate-400 hover:text-white transition-colors">Camera Setup</Link>
              </li>
              <li>
                <Link to="/monitor" className="text-slate-400 hover:text-white transition-colors">Live Monitor</Link>
              </li>
              <li>
                <Link to="/report" className="text-slate-400 hover:text-white transition-colors">Session Report</Link>
              </li>
              <li>
                <Link to="/alert" className="text-slate-400 hover:text-white transition-colors">Alert Demonstration</Link>
              </li>
            </ul>
          </div>

          {/* Product Info */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Product & Privacy</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/settings" className="text-slate-400 hover:text-white transition-colors">Settings & Sensitivity</Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-white transition-colors">How It Works</Link>
              </li>
              <li>
                <Link to="/about#privacy" className="text-slate-400 hover:text-white transition-colors">Privacy Architecture</Link>
              </li>
              <li>
                <Link to="/about#limitations" className="text-slate-400 hover:text-white transition-colors">System Limitations</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-6 border-t border-surface-border/60 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            © {new Date().getFullYear()} DriveGuard. Stay Awake. Stay Focused.
          </p>
          <p className="text-center md:text-right max-w-xl">
            Disclaimer: DriveGuard is an awareness and assistance tool for computer users. It does not provide medical diagnosis, guarantee fatigue prevention, or replace regular breaks.
          </p>
        </div>
      </div>
    </footer>
  );
};
