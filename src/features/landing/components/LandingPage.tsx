import React from 'react';
import { LandingHero } from './LandingHero';
import { LandingFeatures } from './LandingFeatures';
import { LandingCTA } from './LandingCTA';

export const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <LandingHero />
      <LandingFeatures />
      <LandingCTA />
    </div>
  );
};

export default LandingPage;
