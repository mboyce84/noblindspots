import React from 'react';
import LandingNav from '../components/Landing/LandingNav';
import Hero from '../components/Landing/Hero';
import ProblemSection from '../components/Landing/ProblemSection';
import HowItWorks from '../components/Landing/HowItWorks';
import FormShrinkSection from '../components/Landing/FormShrinkSection';
import Differentiators from '../components/Landing/Differentiators';
import WaitlistSection from '../components/Landing/WaitlistSection';
import LandingFooter from '../components/Landing/LandingFooter';

/**
 * Composition only — no copy, no markup beyond ordering.
 *
 * Deliberately does not call useAuth(). Reading auth state here would either
 * flash a spinner on the page paid traffic lands on, or bounce you to the
 * dashboard whenever you tried to view your own ad's landing page. Login
 * already redirects signed-in users, so "Sign in" behaves correctly anyway.
 */
const Landing: React.FC = () => (
  <div className="min-h-screen bg-white">
    <LandingNav />
    <main>
      <Hero />
      <ProblemSection />
      <HowItWorks />
      <FormShrinkSection />
      <Differentiators />
      <WaitlistSection />
    </main>
    <LandingFooter />
  </div>
);

export default Landing;
