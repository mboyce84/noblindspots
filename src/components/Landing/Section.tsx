import React from 'react';

interface SectionProps {
  id?: string;
  /** `gradient` reuses the exact treatment from the login screen, so the
   *  landing page and the app read as one product. */
  tone?: 'white' | 'gray' | 'gradient';
  className?: string;
  children: React.ReactNode;
}

const TONES: Record<NonNullable<SectionProps['tone']>, string> = {
  white: 'bg-white',
  gray: 'bg-gray-50',
  gradient: 'bg-gradient-to-br from-primary-50 via-white to-secondary-50',
};

const Section: React.FC<SectionProps> = ({ id, tone = 'white', className = '', children }) => (
  <section id={id} className={`${TONES[tone]} ${className}`}>
    <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16 sm:py-24">{children}</div>
  </section>
);

export default Section;
