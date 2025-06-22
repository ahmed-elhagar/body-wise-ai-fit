import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface GradientCardProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'soft';
  className?: string;
}

const GradientCard: React.FC<GradientCardProps> = ({
  children,
  variant = 'primary',
  className
}) => {
  const variantStyles = {
    primary: 'bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-primary',
    secondary: 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-secondary',
    accent: 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-accent',
    neutral: 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 border border-gray-200',
    soft: 'bg-gradient-to-br from-white to-gray-50 text-gray-900 border border-gray-200 shadow-sm'
  };

  return (
    <Card className={cn(
      'border-0 backdrop-blur-sm',
      variantStyles[variant],
      className
    )}>
      {children}
    </Card>
  );
};

export default GradientCard; 