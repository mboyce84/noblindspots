import React from 'react';
import { Check } from 'lucide-react';
import Section from './Section';
import { verify, margin, security } from './landingContent';

const Differentiators: React.FC = () => {
  const VerifyIcon = verify.icon;
  const MarginIcon = margin.icon;
  const SecurityIcon = security.icon;

  return (
    <Section tone="gray">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Verification drill-through: the trust answer, and the widest gap
            between this and every template-on-a-spreadsheet competitor. */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 lg:col-span-2">
          <div className="w-10 h-10 rounded-lg bg-primary-50 border border-primary-200 flex items-center justify-center">
            <VerifyIcon className="w-5 h-5 text-primary-600" />
          </div>
          <h3 className="mt-4 text-2xl font-bold text-gray-900 tracking-tight max-w-2xl">
            {verify.heading}
          </h3>
          <p className="mt-3 text-gray-600 leading-relaxed max-w-2xl">{verify.body}</p>
          <ul className="mt-5 space-y-2">
            {verify.points.map((point) => (
              <li key={point} className="flex items-start gap-2 text-gray-700">
                <Check className="w-5 h-5 text-secondary-600 flex-shrink-0 mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="w-10 h-10 rounded-lg bg-accent-50 border border-accent-200 flex items-center justify-center">
            <MarginIcon className="w-5 h-5 text-accent-600" />
          </div>
          <h3 className="mt-4 text-xl font-bold text-gray-900 tracking-tight">{margin.heading}</h3>
          <p className="mt-3 text-gray-600 leading-relaxed">{margin.body}</p>
          <p className="mt-4 pl-4 border-l-2 border-accent-300 text-gray-700 italic">
            {margin.note}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="w-10 h-10 rounded-lg bg-secondary-50 border border-secondary-200 flex items-center justify-center">
            <SecurityIcon className="w-5 h-5 text-secondary-600" />
          </div>
          <h3 className="mt-4 text-xl font-bold text-gray-900 tracking-tight">
            {security.heading}
          </h3>
          <p className="mt-3 text-gray-600 leading-relaxed">{security.body}</p>
        </div>
      </div>
    </Section>
  );
};

export default Differentiators;
