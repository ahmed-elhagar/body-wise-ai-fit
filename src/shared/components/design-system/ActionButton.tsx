/**
 * Universal Action Button Component
 * 
 * Consistent action buttons with brand styling and theme support.
 * Used across all features for primary and secondary actions.
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export interface ActionButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ComponentType<{ className?: string }>;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  children,
  onClick,
  className = '',
  type = 'button',
}) => {
  const sizeConfig = {
    sm: {
      button: 'px-3 py-2 text-sm h-9',
      icon: 'h-4 w-4',
    },
    md: {
      button: 'px-4 py-2.5 text-sm h-10',
      icon: 'h-4 w-4',
    },
    lg: {
      button: 'px-6 py-3 text-base h-12',
      icon: 'h-5 w-5',
    },
  };

  const config = sizeConfig[size];

  const getVariantStyles = () => {
    const baseStyles = `${config.button} font-medium transition-all duration-200 relative overflow-hidden`;
    
    switch (variant) {
      case 'primary':
        return `${baseStyles} bg-gradient-to-r from-brand-primary-500 to-brand-primary-600 hover:from-brand-primary-600 hover:to-brand-primary-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-md`;
      
      case 'secondary':
        return `${baseStyles} bg-gradient-to-r from-brand-secondary-500 to-brand-secondary-600 hover:from-brand-secondary-600 hover:to-brand-secondary-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-md`;
      
      case 'outline':
        return `${baseStyles} bg-transparent border-2 border-brand-primary-500 text-brand-primary-600 hover:bg-brand-primary-50 hover:border-brand-primary-600 hover:text-brand-primary-700`;
      
      case 'ghost':
        return `${baseStyles} bg-transparent text-brand-primary-600 hover:bg-brand-primary-50 hover:text-brand-primary-700`;
      
      case 'destructive':
        return `${baseStyles} bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-md`;
      
      default:
        return `${baseStyles} bg-gradient-to-r from-brand-primary-500 to-brand-primary-600 hover:from-brand-primary-600 hover:to-brand-primary-700 text-white shadow-md hover:shadow-lg`;
    }
  };

  const renderIcon = () => {
    if (loading) {
      return <Loader2 className={`${config.icon} animate-spin`} />;
    }
    
    if (Icon) {
      return <Icon className={config.icon} />;
    }
    
    return null;
  };

  const iconElement = renderIcon();

  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${getVariantStyles()} 
        ${fullWidth ? 'w-full' : ''} 
        ${className}
        ${loading ? 'cursor-not-allowed' : ''}
      `}
    >
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
          <Loader2 className={`${config.icon} animate-spin text-white`} />
        </div>
      )}

      {/* Content */}
      <div className={`flex items-center gap-2 ${loading ? 'opacity-70' : ''}`}>
        {iconElement && iconPosition === 'left' && iconElement}
        <span>{children}</span>
        {iconElement && iconPosition === 'right' && iconElement}
      </div>
    </Button>
  );
};

// Pre-configured action buttons for common use cases
export const GenerateButton: React.FC<Omit<ActionButtonProps, 'icon' | 'variant'>> = (props) => {
  const Sparkles = React.lazy(() => import('lucide-react').then(mod => ({ default: mod.Sparkles })));
  
  return (
    <React.Suspense fallback={<ActionButton variant="primary" {...props} />}>
      <ActionButton
        variant="primary"
        icon={Sparkles}
        {...props}
      />
    </React.Suspense>
  );
};

export const SaveButton: React.FC<Omit<ActionButtonProps, 'icon' | 'variant'>> = (props) => {
  const Save = React.lazy(() => import('lucide-react').then(mod => ({ default: mod.Save })));
  
  return (
    <React.Suspense fallback={<ActionButton variant="primary" {...props} />}>
      <ActionButton
        variant="primary"
        icon={Save}
        {...props}
      />
    </React.Suspense>
  );
};

export const AddButton: React.FC<Omit<ActionButtonProps, 'icon' | 'variant'>> = (props) => {
  const Plus = React.lazy(() => import('lucide-react').then(mod => ({ default: mod.Plus })));
  
  return (
    <React.Suspense fallback={<ActionButton variant="primary" {...props} />}>
      <ActionButton
        variant="primary"
        icon={Plus}
        {...props}
      />
    </React.Suspense>
  );
};

export const EditButton: React.FC<Omit<ActionButtonProps, 'icon' | 'variant'>> = (props) => {
  const Edit = React.lazy(() => import('lucide-react').then(mod => ({ default: mod.Edit })));
  
  return (
    <React.Suspense fallback={<ActionButton variant="outline" {...props} />}>
      <ActionButton
        variant="outline"
        icon={Edit}
        {...props}
      />
    </React.Suspense>
  );
};

export const DeleteButton: React.FC<Omit<ActionButtonProps, 'icon' | 'variant'>> = (props) => {
  const Trash2 = React.lazy(() => import('lucide-react').then(mod => ({ default: mod.Trash2 })));
  
  return (
    <React.Suspense fallback={<ActionButton variant="destructive" {...props} />}>
      <ActionButton
        variant="destructive"
        icon={Trash2}
        {...props}
      />
    </React.Suspense>
  );
};

export const RefreshButton: React.FC<Omit<ActionButtonProps, 'icon' | 'variant'>> = (props) => {
  const RefreshCw = React.lazy(() => import('lucide-react').then(mod => ({ default: mod.RefreshCw })));
  
  return (
    <React.Suspense fallback={<ActionButton variant="ghost" {...props} />}>
      <ActionButton
        variant="ghost"
        icon={RefreshCw}
        {...props}
      />
    </React.Suspense>
  );
};

// Action Button Group Component
export interface ActionButtonGroupProps {
  buttons: React.ReactNode[];
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ActionButtonGroup: React.FC<ActionButtonGroupProps> = ({
  buttons,
  orientation = 'horizontal',
  spacing = 'md',
  className = '',
}) => {
  const spacingConfig = {
    sm: 'gap-1',
    md: 'gap-2',
    lg: 'gap-4',
  };

  const orientationConfig = {
    horizontal: 'flex-row',
    vertical: 'flex-col',
  };

  return (
    <div className={`flex ${orientationConfig[orientation]} ${spacingConfig[spacing]} ${className}`}>
      {buttons.map((button, index) => (
        <React.Fragment key={index}>
          {button}
        </React.Fragment>
      ))}
    </div>
  );
};

// Floating Action Button
export interface FloatingActionButtonProps extends Omit<ActionButtonProps, 'size' | 'fullWidth'> {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  position = 'bottom-right',
  className = '',
  ...props
}) => {
  const positionConfig = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  };

  return (
    <div className={`fixed ${positionConfig[position]} z-50`}>
      <ActionButton
        size="lg"
        className={`rounded-full shadow-2xl hover:shadow-3xl ${className}`}
        {...props}
      />
    </div>
  );
};
