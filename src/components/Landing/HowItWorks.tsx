import React from 'react';
import Section from './Section';
import { how } from './landingContent';

const HowItWorks: React.FC = () => (
  <Section id="how" tone="gray">
    <div className="max-w-3xl">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">{how.heading}</h2>
      <p className="mt-4 text-lg text-gray-600">{how.intro}</p>
    </div>

    <div className="mt-12 grid gap-6 md:grid-cols-3">
      {how.steps.map((step) => {
        const Icon = step.icon;
        return (
          <div key={step.n} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-primary-50 border border-primary-200 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary-600" />
              </div>
              <span className="text-sm font-bold text-gray-300 tabular-nums">{step.n}</span>
            </div>
            <h3 className="mt-4 font-bold text-gray-900">{step.title}</h3>
            <p className="mt-2 text-gray-600 leading-relaxed">{step.body}</p>
          </div>
        );
      })}
    </div>
  </Section>
);

export default HowItWorks;
