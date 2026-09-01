import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Section from './Section';
import DashboardPreview from './DashboardPreview';
import { hero } from './landingContent';

const Hero: React.FC = () => (
  <Section tone="gradient">
    <div className="animate-fade-in">
      <div className="max-w-3xl">
        <span className="inline-block px-3 py-1 rounded-full bg-white border border-primary-200 text-primary-700 text-xs font-medium tracking-wide uppercase">
          {hero.eyebrow}
        </span>

        <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-[1.1]">
          {hero.headline}
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed">{hero.subhead}</p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center">
          <a
            href="#waitlist"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            {hero.cta}
            <ArrowRight className="w-4 h-4" />
          </a>
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            {hero.secondaryCta}
          </Link>
        </div>

        <p className="mt-4 text-sm text-gray-500">{hero.reassurance}</p>
      </div>

      <div className="mt-14">
        <DashboardPreview />
      </div>
    </div>
  </Section>
);

export default Hero;
