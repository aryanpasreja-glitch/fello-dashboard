import React from 'react';

interface DashboardCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  percentage?: number;
  gradient?: 'blue' | 'accent' | 'purple';
  icon?: React.ReactNode;
}

export default function DashboardCard({
  title,
  value,
  subtitle,
  percentage,
  gradient = 'blue',
  icon
}: DashboardCardProps) {
  const gradientClasses = {
    blue: 'from-fello-blue to-fello-purple',
    accent: 'from-fello-pink to-fello-coral',
    purple: 'from-fello-purple to-fello-pink'
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wide">{title}</h3>
          {subtitle && (
            <p className="text-xs text-gray-400">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="text-fello-purple">{icon}</div>
        )}
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold text-fello-navy">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {percentage !== undefined && (
          <span className="text-sm font-semibold text-fello-purple">
            ({percentage}%)
          </span>
        )}
      </div>

      {percentage !== undefined && (
        <div className="mt-4">
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <div
              className={`bg-gradient-to-r ${gradientClasses[gradient]} h-2.5 rounded-full transition-all duration-500`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

