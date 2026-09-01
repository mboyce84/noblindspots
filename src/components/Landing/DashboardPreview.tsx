import React from 'react';
import { DollarSign, CalendarCheck, Percent, PiggyBank } from 'lucide-react';
import MetricCard from '../Dashboard/MetricCard';

/**
 * A still illustration, not a live dashboard.
 *
 * Two deliberate choices:
 *  1. Values are hardcoded here rather than pulled from mockData.ts. That
 *     module is Math.random()-based (numbers would change on every mount) and
 *     contains real rep names, which must never appear on a public page.
 *  2. No recharts. It is the bulk of the bundle, and this page's job is a fast
 *     first paint for paid traffic. The chart below is ~30 lines of SVG.
 *
 * The funnel reconciles against the benchmarks the curriculum teaches:
 * 1,240 leads → 310 booked (25%) → 217 showed (70%) → 54 closed (25%).
 */

const TREND = [22, 30, 26, 38, 34, 46, 42, 55, 61, 58, 72, 79];

const FUNNEL = [
  { label: 'Leads', value: 1240, pct: 100 },
  { label: 'Booked', value: 310, pct: 25 },
  { label: 'Showed', value: 217, pct: 17.5 },
  { label: 'Closed', value: 54, pct: 4.4 },
];

const Sparkline: React.FC = () => {
  const max = Math.max(...TREND);
  const points = TREND.map((v, i) => {
    const x = (i / (TREND.length - 1)) * 100;
    const y = 32 - (v / max) * 28;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(' ');

  return (
    <svg
      viewBox="0 0 100 32"
      preserveAspectRatio="none"
      className="w-full h-24"
      role="img"
      aria-label="Cash collected trending upward over twelve weeks"
    >
      <polyline
        points={points}
        fill="none"
        stroke="#2563eb"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

const DashboardPreview: React.FC = () => (
  <div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard title="Cash collected" value="$187,400" icon={DollarSign} color="primary" />
      <MetricCard title="Show rate" value="70.0%" icon={Percent} color="secondary" />
      <MetricCard title="Booked calls" value="310" icon={CalendarCheck} color="accent" />
      <MetricCard title="Contribution margin" value="$61,900" icon={PiggyBank} color="success" />
    </div>

    <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-sm font-medium text-gray-600">Cash collected, last 12 weeks</h3>
        <div className="mt-4">
          <Sparkline />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-sm font-medium text-gray-600">Pipeline</h3>
        <div className="mt-4 space-y-3">
          {FUNNEL.map((stage) => (
            <div key={stage.label}>
              <div className="flex items-baseline justify-between text-sm">
                <span className="font-medium text-gray-700">{stage.label}</span>
                <span className="text-gray-900 font-semibold tabular-nums">
                  {stage.value.toLocaleString()}
                </span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary-600"
                  style={{ width: `${stage.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <p className="mt-3 text-xs text-gray-500">
      Illustration. Your dashboard is built from your own data.
    </p>
  </div>
);

export default DashboardPreview;
