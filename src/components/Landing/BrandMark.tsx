import React from 'react';
import { BarChart3 } from 'lucide-react';

interface BrandMarkProps {
  size?: 'sm' | 'md' | 'lg';
  /** Set false on dark backgrounds where the wordmark would disappear. */
  showWordmark?: boolean;
}

const BOX = {
  sm: 'w-8 h-8 rounded-lg',
  md: 'w-10 h-10 rounded-lg',
  lg: 'w-16 h-16 rounded-2xl',
};

const ICON = {
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

const TEXT = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-3xl',
};

const BrandMark: React.FC<BrandMarkProps> = ({ size = 'md', showWordmark = true }) => (
  <div className="flex items-center space-x-3">
    <div className={`${BOX[size]} bg-primary-600 flex items-center justify-center flex-shrink-0`}>
      <BarChart3 className={`${ICON[size]} text-white`} />
    </div>
    {showWordmark && (
      <span className={`${TEXT[size]} font-bold text-gray-900 tracking-tight`}>NoBlindSpots</span>
    )}
  </div>
);

export default BrandMark;
