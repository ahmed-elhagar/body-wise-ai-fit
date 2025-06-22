/**
 * Universal Tab Button Component
 * 
 * Unified tab navigation component used across all features.
 * Provides consistent styling and behavior.
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { TabItem } from './FeatureLayout';

export interface TabButtonProps {
  tab: TabItem;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'pills' | 'underline';
}

export const TabButton: React.FC<TabButtonProps> = ({
  tab,
  isActive,
  onClick,
  disabled = false,
  size = 'md',
  variant = 'default',
}) => {
  const { icon: Icon, label, badge } = tab;

  const sizeConfig = {
    sm: {
      button: 'px-3 py-2 text-sm',
      icon: 'h-4 w-4',
      gap: 'gap-2',
    },
    md: {
      button: 'px-4 py-2.5 text-sm',
      icon: 'h-4 w-4',
      gap: 'gap-2',
    },
    lg: {
      button: 'px-6 py-3 text-base',
      icon: 'h-5 w-5',
      gap: 'gap-3',
    },
  };

  const config = sizeConfig[size];

  const getVariantStyles = () => {
    const baseStyles = `${config.button} ${config.gap} font-medium transition-all duration-200 relative flex items-center justify-center`;
    
    switch (variant) {
      case 'pills':
        return isActive
          ? `${baseStyles} bg-gradient-to-r from-brand-primary-500 to-brand-primary-600 hover:from-brand-primary-600 hover:to-brand-primary-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5`
          : `${baseStyles} bg-white/60 text-brand-neutral-600 hover:bg-white/80 hover:text-brand-neutral-800 border border-brand-neutral-200`;
      
      case 'underline':
        return isActive
          ? `${baseStyles} bg-transparent text-brand-primary-600 border-b-2 border-brand-primary-500 rounded-none`
          : `${baseStyles} bg-transparent text-brand-neutral-600 hover:text-brand-primary-500 border-b-2 border-transparent rounded-none`;
      
      default:
        return isActive
          ? `${baseStyles} bg-white/90 text-brand-primary-600 shadow-md border border-brand-primary-200`
          : `${baseStyles} bg-white/40 text-brand-neutral-600 hover:bg-white/60 hover:text-brand-neutral-800 border border-transparent`;
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={onClick}
      disabled={disabled || tab.disabled}
      className={getVariantStyles()}
    >
      <Icon className={`${config.icon} ${isActive ? 'text-brand-primary-500' : 'text-current'}`} />
      <span className="whitespace-nowrap">{label}</span>
      
      {badge && (
        <Badge 
          variant={isActive ? 'default' : 'secondary'} 
          className="ml-1 h-5 min-w-[20px] text-xs"
        >
          {badge}
        </Badge>
      )}
      
      {/* Active indicator for default variant */}
      {variant === 'default' && isActive && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-brand-primary-500 rounded-full"></div>
      )}
    </Button>
  );
};

// Tab Group Component for better organization
export interface TabGroupProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
}

export const TabGroup: React.FC<TabGroupProps> = ({
  tabs,
  activeTab,
  onTabChange,
  disabled = false,
  size = 'md',
  variant = 'default',
  className = '',
}) => {
  const containerStyles = {
    default: 'flex items-center space-x-1 overflow-x-auto',
    pills: 'flex items-center space-x-2 overflow-x-auto p-1 bg-brand-neutral-100 rounded-lg',
    underline: 'flex items-center space-x-4 overflow-x-auto border-b border-brand-neutral-200',
  };

  return (
    <div className={`${containerStyles[variant]} ${className}`}>
      {tabs.map((tab) => (
        <TabButton
          key={tab.id}
          tab={tab}
          isActive={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
          disabled={disabled}
          size={size}
          variant={variant}
        />
      ))}
    </div>
  );
};

// Mobile-optimized tab component
export const MobileTabButton: React.FC<TabButtonProps> = (props) => {
  return (
    <TabButton
      {...props}
      size="sm"
      variant="pills"
    />
  );
};
