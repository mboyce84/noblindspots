import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  color = 'primary'
}) => {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-700 border-primary-200',
    secondary: 'bg-secondary-50 text-secondary-700 border-secondary-200',
    accent: 'bg-accent-50 text-accent-700 border-accent-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    error: 'bg-red-50 text-red-700 border-red-200',
  };

  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm font-medium mt-1 ${changeColors[changeType]}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default MetricCard;