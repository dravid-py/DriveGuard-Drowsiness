import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X, Sliders, Activity, HelpCircle } from 'lucide-react';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'How It Works', path: '/about' },
    { label: 'Settings', path: '/settings' },
    { label: 'About', path: '/about' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-slate-100 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1"
            aria-label="DriveGuard Home"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:border-emerald-400 transition-colors">
              <Shield className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-wider text-base sm:text-lg text-white font-mono-num">
                DRIVEGUARD
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-tight -mt-1 hidden sm:block">
                Stay Awake. Stay Focused.
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <Link
                key={link.path + link.label}
                to={link.path}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-white bg-surface-elevated border border-surface-border'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-surface-card'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/monitor">
              <Button variant="ghost" size="sm" leftIcon={<Activity className="w-4 h-4 text-emerald-400" />}>
                Monitor
              </Button>
            </Link>
            <Link to="/camera">
              <Button variant="primary" size="sm">
                Start Monitoring
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link to="/camera">
              <Button variant="primary" size="sm" className="text-xs px-2.5 py-1.5">
                Start
              </Button>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-surface-border bg-surface-card/95 backdrop-blur-lg px-4 pt-2 pb-6 space-y-2 animate-in fade-in duration-200">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path + link.label}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-white bg-surface-elevated border border-surface-border'
                    : 'text-slate-300 hover:text-white hover:bg-surface-elevated'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/monitor"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-surface-elevated flex items-center gap-2"
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              Live Dashboard
            </Link>
            <Link
              to="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-surface-elevated flex items-center gap-2"
            >
              <Sliders className="w-4 h-4 text-slate-400" />
              Settings
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-surface-elevated flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              About & Architecture
            </Link>
          </div>
          <div className="pt-3 border-t border-surface-border">
            <Link to="/camera" onClick={() => setMobileMenuOpen(false)} className="block w-full">
              <Button variant="primary" size="md" className="w-full">
                Start Monitoring
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
