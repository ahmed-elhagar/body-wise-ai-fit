/**
 * Theme Selector Component
 * 
 * Allows users to switch between different theme variants.
 * Can be used in settings or as a quick theme switcher.
 */

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Palette } from 'lucide-react';
import { useTheme } from '@/shared/hooks/useTheme';

export interface ThemeSelectorProps {
  variant?: 'grid' | 'dropdown' | 'inline';
  size?: 'sm' | 'md' | 'lg';
  showPreview?: boolean;
  showLabels?: boolean;
  className?: string;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  variant = 'grid',
  size = 'md',
  showPreview = true,
  showLabels = true,
  className = '',
}) => {
  const { 
    currentThemeName, 
    availableThemes, 
    switchTheme, 
    getThemePreview, 
    isLoading 
  } = useTheme();
  
  const [isOpen, setIsOpen] = useState(false);

  const sizeConfig = {
    sm: {
      card: 'p-2',
      preview: 'h-8 w-12',
      text: 'text-xs',
      button: 'h-8 px-2 text-xs',
    },
    md: {
      card: 'p-3',
      preview: 'h-12 w-16',
      text: 'text-sm',
      button: 'h-10 px-3 text-sm',
    },
    lg: {
      card: 'p-4',
      preview: 'h-16 w-20',
      text: 'text-base',
      button: 'h-12 px-4 text-base',
    },
  };

  const config = sizeConfig[size];

  const ThemePreview: React.FC<{ themeName: string; isSelected: boolean }> = ({ 
    themeName, 
    isSelected 
  }) => {
    const preview = getThemePreview(themeName);
    
    return (
      <div
        className={`
          ${config.preview} 
          rounded-lg 
          border-2 
          ${isSelected ? 'border-brand-primary-500' : 'border-brand-neutral-200'} 
          cursor-pointer 
          transition-all 
          duration-200 
          hover:scale-105 
          relative 
          overflow-hidden
        `}
        onClick={() => switchTheme(themeName)}
      >
        {/* Gradient Preview */}
        <div 
          className={`h-full w-full bg-gradient-to-br ${preview.gradient}`}
        />
        
        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <Check className="h-4 w-4 text-white" />
          </div>
        )}
        
        {/* Loading Overlay */}
        {isLoading && isSelected && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <div className="h-3 w-3 border-2 border-brand-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    );
  };

  const ThemeOption: React.FC<{ themeName: string }> = ({ themeName }) => {
    const preview = getThemePreview(themeName);
    const isSelected = currentThemeName === themeName;

    return (
      <Card 
        className={`
          ${config.card} 
          cursor-pointer 
          transition-all 
          duration-200 
          hover:shadow-md 
          ${isSelected ? 'ring-2 ring-brand-primary-500 bg-brand-primary-50' : 'hover:bg-brand-neutral-50'}
        `}
        onClick={() => switchTheme(themeName)}
      >
        <CardContent className="p-0">
          <div className="flex items-center space-x-3">
            {showPreview && (
              <ThemePreview themeName={themeName} isSelected={isSelected} />
            )}
            
            {showLabels && (
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={`${config.text} font-medium text-brand-neutral-800`}>
                    {preview.name}
                  </span>
                  {isSelected && (
                    <Badge variant="default" className="ml-2">
                      Active
                    </Badge>
                  )}
                </div>
                
                {/* Color Indicators */}
                <div className="flex items-center space-x-1 mt-1">
                  <div 
                    className="h-3 w-3 rounded-full border border-brand-neutral-300"
                    style={{ backgroundColor: preview.primaryColor }}
                  />
                  <div 
                    className="h-3 w-3 rounded-full border border-brand-neutral-300"
                    style={{ backgroundColor: preview.secondaryColor }}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className={config.button}
        >
          <Palette className="h-4 w-4 mr-2" />
          Theme
        </Button>
        
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-brand-neutral-200 z-50">
            <div className="p-2 space-y-1">
              {availableThemes.map((theme) => (
                <ThemeOption key={theme.key} themeName={theme.key} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {availableThemes.map((theme) => (
          <ThemePreview 
            key={theme.key} 
            themeName={theme.key} 
            isSelected={currentThemeName === theme.key} 
          />
        ))}
      </div>
    );
  }

  // Grid variant (default)
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-2">
        <Palette className="h-5 w-5 text-brand-primary-500" />
        <h3 className="text-lg font-semibold text-brand-neutral-800">
          Choose Theme
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {availableThemes.map((theme) => (
          <ThemeOption key={theme.key} themeName={theme.key} />
        ))}
      </div>
    </div>
  );
};

// Quick theme switcher for headers/toolbars
export const QuickThemeSwitch: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <ThemeSelector
      variant="inline"
      size="sm"
      showPreview={true}
      showLabels={false}
      className={className}
    />
  );
};

// Theme settings panel
export const ThemeSettingsPanel: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { currentThemeName, availableThemes } = useTheme();
  const currentTheme = availableThemes.find(t => t.key === currentThemeName);

  return (
    <Card className={`p-6 ${className}`}>
      <CardContent className="p-0 space-y-6">
        {/* Current Theme Info */}
        <div>
          <h3 className="text-lg font-semibold text-brand-neutral-800 mb-2">
            Current Theme
          </h3>
          <div className="flex items-center space-x-3 p-3 bg-brand-primary-50 rounded-lg">
            <div className="h-8 w-8 rounded bg-gradient-to-br from-brand-primary-500 to-brand-secondary-500" />
            <span className="font-medium text-brand-neutral-800">
              {currentTheme?.name}
            </span>
            <Badge variant="default">Active</Badge>
          </div>
        </div>

        {/* Theme Selector */}
        <ThemeSelector
          variant="grid"
          size="md"
          showPreview={true}
          showLabels={true}
        />

        {/* Theme Info */}
        <div className="text-sm text-brand-neutral-600">
          <p>
            Themes change the color scheme across the entire application. 
            Your preference will be saved automatically.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
