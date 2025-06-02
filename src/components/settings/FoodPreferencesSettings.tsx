
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { X, Plus } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";

const CUISINES = [
  'Italian', 'Chinese', 'Indian', 'Mexican', 'Japanese', 'Thai', 'French',
  'Mediterranean', 'Middle Eastern', 'American', 'Korean', 'Vietnamese',
  'Greek', 'Spanish', 'Turkish', 'Lebanese', 'Moroccan', 'Ethiopian'
];

const COMMON_ALLERGIES = [
  'Nuts', 'Peanuts', 'Shellfish', 'Fish', 'Eggs', 'Dairy', 'Soy',
  'Wheat', 'Gluten', 'Sesame', 'Mustard', 'Celery', 'Lupin'
];

export const FoodPreferencesSettings = () => {
  const { profile, updateProfile } = useProfile();
  const [preferences, setPreferences] = useState({
    preferredCuisines: profile?.preferred_foods || [],
    allergies: profile?.allergies || [],
    dietaryRestrictions: profile?.dietary_restrictions || [],
    isHalal: false,
    isVegetarian: false,
    isVegan: false,
    isKeto: false,
    isLowCarb: false
  });

  const [newAllergy, setNewAllergy] = useState('');
  const [newRestriction, setNewRestriction] = useState('');

  const toggleCuisine = (cuisine: string) => {
    setPreferences(prev => ({
      ...prev,
      preferredCuisines: prev.preferredCuisines.includes(cuisine)
        ? prev.preferredCuisines.filter(c => c !== cuisine)
        : [...prev.preferredCuisines, cuisine]
    }));
  };

  const addAllergy = (allergy: string) => {
    if (allergy && !preferences.allergies.includes(allergy)) {
      setPreferences(prev => ({
        ...prev,
        allergies: [...prev.allergies, allergy]
      }));
      setNewAllergy('');
    }
  };

  const removeAllergy = (allergy: string) => {
    setPreferences(prev => ({
      ...prev,
      allergies: prev.allergies.filter(a => a !== allergy)
    }));
  };

  const addDietaryRestriction = () => {
    if (newRestriction && !preferences.dietaryRestrictions.includes(newRestriction)) {
      setPreferences(prev => ({
        ...prev,
        dietaryRestrictions: [...prev.dietaryRestrictions, newRestriction]
      }));
      setNewRestriction('');
    }
  };

  const removeDietaryRestriction = (restriction: string) => {
    setPreferences(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.filter(r => r !== restriction)
    }));
  };

  const handleSave = async () => {
    try {
      // Build dietary restrictions array
      const dietaryRestrictions = [...preferences.dietaryRestrictions];
      if (preferences.isHalal) dietaryRestrictions.push('Halal');
      if (preferences.isVegetarian) dietaryRestrictions.push('Vegetarian');
      if (preferences.isVegan) dietaryRestrictions.push('Vegan');
      if (preferences.isKeto) dietaryRestrictions.push('Keto');
      if (preferences.isLowCarb) dietaryRestrictions.push('Low Carb');

      await updateProfile({
        preferred_foods: preferences.preferredCuisines,
        allergies: preferences.allergies,
        dietary_restrictions: [...new Set(dietaryRestrictions)] // Remove duplicates
      });
      
      toast.success('Food preferences updated successfully!');
    } catch (error) {
      console.error('Error updating food preferences:', error);
      toast.error('Failed to update food preferences');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Food Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preferred Cuisines */}
        <div className="space-y-3">
          <Label>Preferred Cuisines</Label>
          <div className="grid grid-cols-3 gap-2">
            {CUISINES.map(cuisine => (
              <div
                key={cuisine}
                onClick={() => toggleCuisine(cuisine)}
                className={`p-2 border rounded-lg cursor-pointer text-center text-sm transition-colors ${
                  preferences.preferredCuisines.includes(cuisine)
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : 'hover:bg-gray-50'
                }`}
              >
                {cuisine}
              </div>
            ))}
          </div>
        </div>

        {/* Dietary Restrictions Toggles */}
        <div className="space-y-3">
          <Label>Dietary Restrictions</Label>
          <div className="space-y-3">
            {[
              { key: 'isHalal', label: 'Halal Food Only' },
              { key: 'isVegetarian', label: 'Vegetarian' },
              { key: 'isVegan', label: 'Vegan' },
              { key: 'isKeto', label: 'Ketogenic Diet' },
              { key: 'isLowCarb', label: 'Low Carb Diet' }
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between">
                <Label>{label}</Label>
                <Switch
                  checked={preferences[key as keyof typeof preferences] as boolean}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, [key]: checked }))
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* Custom Dietary Restrictions */}
        <div className="space-y-3">
          <Label>Additional Dietary Restrictions</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Add custom restriction..."
              value={newRestriction}
              onChange={(e) => setNewRestriction(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addDietaryRestriction()}
            />
            <Button onClick={addDietaryRestriction} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {preferences.dietaryRestrictions.map(restriction => (
              <Badge key={restriction} variant="secondary" className="flex items-center gap-1">
                {restriction}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-red-600"
                  onClick={() => removeDietaryRestriction(restriction)}
                />
              </Badge>
            ))}
          </div>
        </div>

        {/* Allergies */}
        <div className="space-y-3">
          <Label>Allergies</Label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Type allergy or select common ones below..."
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addAllergy(newAllergy)}
              />
              <Button onClick={() => addAllergy(newAllergy)} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Common Allergies */}
            <div className="flex flex-wrap gap-1">
              {COMMON_ALLERGIES.filter(allergy => !preferences.allergies.includes(allergy)).map(allergy => (
                <button
                  key={allergy}
                  onClick={() => addAllergy(allergy)}
                  className="px-2 py-1 text-xs border rounded hover:bg-gray-50"
                >
                  + {allergy}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {preferences.allergies.map(allergy => (
              <Badge key={allergy} variant="destructive" className="flex items-center gap-1">
                {allergy}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removeAllergy(allergy)}
                />
              </Badge>
            ))}
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Food Preferences
        </Button>
      </CardContent>
    </Card>
  );
};
