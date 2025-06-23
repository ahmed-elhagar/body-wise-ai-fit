
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatItem {
  label: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  color: 'orange' | 'green' | 'blue' | 'purple';
}

export interface GradientStatsCardProps {
  title: string;
  stats: StatItem[];
  className?: string;
}

const colorVariants = {
  orange: {
    gradient: 'from-orange-500 to-red-500',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    accent: 'text-orange-600'
  },
  green: {
    gradient: 'from-green-500 to-emerald-500',
    bg: 'bg-green-50',
    text: 'text-green-700',
    accent: 'text-green-600'
  },
  blue: {
    gradient: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    accent: 'text-blue-600'
  },
  purple: {
    gradient: 'from-purple-500 to-pink-500',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    accent: 'text-purple-600'
  }
};

const GradientStatsCard = ({ title, stats, className = '' }: GradientStatsCardProps) => {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className={`h-1.5 bg-gradient-to-r ${colorVariants[stats[0]?.color || 'blue'].gradient}`} />
      <CardContent className="p-3">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {stats.map((stat, index) => {
            const variant = colorVariants[stat.color];
            return (
              <div key={index} className={`p-2 rounded-lg ${variant.bg}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 mb-0.5">{stat.label}</p>
                    <p className={`text-lg font-bold ${variant.text}`}>
                      {stat.value}
                    </p>
                  </div>
                  {stat.change && (
                    <div className={`flex items-center ${stat.change.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change.isPositive ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      <span className="text-xs font-medium ml-1">
                        {Math.abs(stat.change.value)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default GradientStatsCard;
