
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Palette, Check } from 'lucide-react';
import { useDesignSystem } from '@/shared/hooks/useDesignSystem';

const ThemeSelector = () => {
  const { 
    theme, 
    isDark, 
    colors, 
    classes, 
    currentThemeName,
    switchTheme,
    getThemePreview,
    isLoading
  } = useDesignSystem();

  const [selectedTheme, setSelectedTheme] = useState(currentThemeName);

  const themes = [
    { id: 'fitfatta', name: 'FitFatta' },
    { id: 'ocean', name: 'Ocean Blue' },
    { id: 'forest', name: 'Forest Green' },
    { id: 'sunset', name: 'Sunset Orange' }
  ];

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
    const themeData = themes.find(t => t.id === themeId);
    if (themeData) {
      // Here you would implement actual theme switching logic
      console.log('Switching to theme:', themeData.name);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Theme Selector
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Theme Mode Toggle */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Theme Mode</h3>
          <div className="flex gap-2">
            {(['light', 'dark', 'auto'] as const).map((mode) => (
              <Button
                key={mode}
                variant={theme === mode ? 'default' : 'outline'}
                size="sm"
                onClick={() => switchTheme(mode)}
                disabled={isLoading}
                className="capitalize"
              >
                {mode}
              </Button>
            ))}
          </div>
        </div>

        {/* Theme Selection */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Color Theme</h3>
          <div className="grid grid-cols-2 gap-3">
            {themes.map((themeOption) => {
              const preview = getThemePreview(themeOption.id);
              const isSelected = selectedTheme === themeOption.id;
              
              return (
                <div
                  key={themeOption.id}
                  className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleThemeChange(themeOption.id)}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-3">
                    <div className="flex gap-1 mb-2">
                      <div className="w-6 h-6 bg-blue-500 rounded"></div>
                      <div className="w-6 h-6 bg-green-500 rounded"></div>
                      <div className="w-6 h-6 bg-orange-500 rounded"></div>
                    </div>
                    <h4 className="font-medium text-sm">{themeOption.name}</h4>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Theme Info */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Current Theme</h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{currentThemeName}</Badge>
            <Badge variant={isDark ? 'default' : 'secondary'}>
              {isDark ? 'Dark' : 'Light'} Mode
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeSelector;
