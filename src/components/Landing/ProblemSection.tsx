import React from 'react';
import Section from './Section';
import { problem } from './landingContent';

const ProblemSection: React.FC = () => (
  <Section id="problem" tone="white">
    <div className="max-w-3xl">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
        {problem.heading}
      </h2>
      <p className="mt-4 text-lg text-gray-600">{problem.intro}</p>
    </div>

    <div className="mt-12 grid gap-6 sm:grid-cols-2">
      {problem.items.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.title} className="bg-gray-50 rounded-lg border border-gray-200 p-6">
            <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary-600" />
            </div>
            <h3 className="mt-4 font-bold text-gray-900">{item.title}</h3>
            <p className="mt-2 text-gray-600 leading-relaxed">{item.body}</p>
          </div>
        );
      })}
    </div>
  </Section>
);

export default ProblemSection;
