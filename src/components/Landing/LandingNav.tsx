import React from 'react';
import { Link } from 'react-router-dom';
import BrandMark from './BrandMark';
import { nav } from './landingContent';

const LandingNav: React.FC = () => (
  <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-200">
    <div className="mx-auto max-w-6xl px-5 sm:px-8 h-16 flex items-center justify-between">
      <BrandMark size="sm" />

      <nav className="flex items-center gap-6">
        {/* Anchor links are supporting navigation, not the path to conversion.
            Hiding them under sm avoids a hamburger for two links. */}
        <div className="hidden sm:flex items-center gap-6">
          {nav.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <Link
          to="/login"
          className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          {nav.signIn}
        </Link>

        <a
          href="#waitlist"
          className="hidden sm:inline-flex px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          {nav.cta}
        </a>
      </nav>
    </div>
  </header>
);

export default LandingNav;
