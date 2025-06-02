
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CuisineSelector } from './food-preferences/CuisineSelector';
import { DietaryRestrictionsToggles } from './food-preferences/DietaryRestrictionsToggles';
import { CustomRestrictionsManager } from './food-preferences/CustomRestrictionsManager';
import { AllergiesManager } from './food-preferences/AllergiesManager';
import { useFoodPreferences } from './food-preferences/useFoodPreferences';
import { Loader2 } from 'lucide-react';

export const FoodPreferencesSettings = () => {
  const { preferences, setPreferences, handleSave, isLoading } = useFoodPreferences();

  const toggleCuisine = (cuisine: string) => {
    setPreferences(prev => ({
      ...prev,
      preferredCuisines: prev.preferredCuisines.includes(cuisine)
        ? prev.preferredCuisines.filter(c => c !== cuisine)
        : [...prev.preferredCuisines, cuisine]
    }));
  };

  const handleToggleRestriction = (key: string, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const addDietaryRestriction = (restriction: string) => {
    setPreferences(prev => ({
      ...prev,
      dietaryRestrictions: [...prev.dietaryRestrictions, restriction]
    }));
  };

  const removeDietaryRestriction = (restriction: string) => {
    setPreferences(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.filter(r => r !== restriction)
    }));
  };

  const addAllergy = (allergy: string) => {
    setPreferences(prev => ({
      ...prev,
      allergies: [...prev.allergies, allergy]
    }));
  };

  const removeAllergy = (allergy: string) => {
    setPreferences(prev => ({
      ...prev,
      allergies: prev.allergies.filter(a => a !== allergy)
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Food Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <CuisineSelector
          selectedCuisines={preferences.preferredCuisines}
          onToggleCuisine={toggleCuisine}
        />

        <DietaryRestrictionsToggles
          preferences={preferences}
          onToggle={handleToggleRestriction}
        />

        <CustomRestrictionsManager
          restrictions={preferences.dietaryRestrictions}
          onAdd={addDietaryRestriction}
          onRemove={removeDietaryRestriction}
        />

        <AllergiesManager
          allergies={preferences.allergies}
          onAdd={addAllergy}
          onRemove={removeAllergy}
        />

        <Button 
          onClick={handleSave} 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Food Preferences'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
