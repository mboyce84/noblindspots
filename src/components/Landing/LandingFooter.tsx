import React from 'react';
import { Link } from 'react-router-dom';
import BrandMark from './BrandMark';
import { footer, nav } from './landingContent';

const LandingFooter: React.FC = () => (
  <footer className="bg-white border-t border-gray-200">
    <div className="mx-auto max-w-6xl px-5 sm:px-8 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
      <div>
        <BrandMark size="sm" />
        <p className="mt-3 text-sm text-gray-600">{footer.tagline}</p>
        <p className="mt-1 text-sm text-gray-500">{footer.note}</p>
      </div>

      <div className="flex items-center gap-6">
        <Link
          to="/login"
          className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          {nav.signIn}
        </Link>
        <a
          href="#waitlist"
          className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          {nav.cta}
        </a>
      </div>
    </div>
  </footer>
);

export default LandingFooter;
