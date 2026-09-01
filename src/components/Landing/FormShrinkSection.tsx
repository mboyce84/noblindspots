import React from 'react';
import Section from './Section';
import { formShrink } from './landingContent';

const FormShrinkSection: React.FC = () => {
  const { rows, totals, columns } = formShrink;

  return (
    <Section tone="white">
      <div className="max-w-3xl">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
          {formShrink.heading}
        </h2>
        <p className="mt-4 text-lg text-gray-600">{formShrink.intro}</p>
      </div>

      {/* Wide content scrolls inside its own container so the page body never
          scrolls horizontally on a phone. */}
      <div className="mt-10 overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 pr-4 text-sm font-medium text-gray-600">
                {columns.role}
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                {columns.total}
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-primary-700">
                {columns.derivable}
              </th>
              <th className="text-right py-3 pl-4 text-sm font-medium text-gray-600">
                {columns.human}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.role} className="border-b border-gray-100">
                <td className="py-3 pr-4 font-medium text-gray-900">{row.role}</td>
                <td className="py-3 px-4 text-right tabular-nums text-gray-700">{row.total}</td>
                <td className="py-3 px-4 text-right tabular-nums font-semibold text-primary-700">
                  {row.derivable}
                </td>
                <td className="py-3 pl-4 text-right tabular-nums text-gray-700">{row.human}</td>
              </tr>
            ))}
            <tr className="border-t-2 border-gray-300">
              <td className="py-3 pr-4 font-bold text-gray-900">Total</td>
              <td className="py-3 px-4 text-right tabular-nums font-bold text-gray-900">
                {totals.total}
              </td>
              <td className="py-3 px-4 text-right tabular-nums font-bold text-primary-700">
                {totals.derivable}
              </td>
              <td className="py-3 pl-4 text-right tabular-nums font-bold text-gray-900">
                {totals.human}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-8 text-lg text-gray-900 font-medium max-w-3xl">{formShrink.kicker}</p>

      <div className="mt-8 bg-gray-50 rounded-lg border border-gray-200 p-6 max-w-3xl">
        <h3 className="font-bold text-gray-900">{formShrink.keeps.heading}</h3>
        <p className="mt-2 text-gray-600 leading-relaxed">{formShrink.keeps.body}</p>
      </div>
    </Section>
  );
};

export default FormShrinkSection;
