import React from 'react';
import { Link } from 'react-router-dom';
import BrandMark from '../components/Landing/BrandMark';
import { notFound } from '../components/Landing/landingContent';

/**
 * A real 404 rather than a redirect to `/`. Silently bouncing unknown URLs to
 * the landing page would make typo'd links indistinguishable from real ad
 * landings in analytics.
 */
const NotFound: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
    <div className="max-w-md w-full text-center">
      <div className="flex justify-center">
        <BrandMark size="lg" showWordmark={false} />
      </div>
      <h1 className="mt-6 text-3xl font-bold text-gray-900">{notFound.heading}</h1>
      <p className="mt-3 text-gray-600">{notFound.body}</p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
      >
        {notFound.cta}
      </Link>
    </div>
  </div>
);

export default NotFound;
