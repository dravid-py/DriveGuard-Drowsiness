import React from 'react';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { HowItWorksFlow } from '../components/landing/HowItWorksFlow';
import { TargetAudience } from '../components/landing/TargetAudience';
import { PrivacyBanner } from '../components/landing/PrivacyBanner';

export const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col">
      <Hero />
      <Features />
      <HowItWorksFlow />
      <TargetAudience />
      <PrivacyBanner />
    </div>
  );
};
