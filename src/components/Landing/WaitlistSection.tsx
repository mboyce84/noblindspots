import React from 'react';
import Section from './Section';
import WaitlistForm from './WaitlistForm';
import { waitlist, founder } from './landingContent';

const WaitlistSection: React.FC = () => (
  <Section id="waitlist" tone="gradient">
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 lg:items-start">
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
          {waitlist.heading}
        </h2>
        <p className="mt-4 text-lg text-gray-600 leading-relaxed">{waitlist.body}</p>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            {founder.heading}
          </h3>
          <p className="mt-3 text-gray-600 leading-relaxed">{founder.body}</p>
          <p className="mt-3 font-medium text-gray-900">{founder.name}</p>
        </div>
      </div>

      <WaitlistForm />
    </div>
  </Section>
);

export default WaitlistSection;
