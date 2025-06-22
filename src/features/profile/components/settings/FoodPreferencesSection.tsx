
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';

const FoodPreferencesSection = () => {
  const isLoading = false;

  const handleSave = async () => {
    // This will be implemented in Phase 2
    console.log('Save food preferences');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Food Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-8 text-center bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">
            Advanced food preferences will be available in Phase 2
          </p>
          <p className="text-sm text-gray-500">
            This will include cuisine selection, dietary restrictions, custom restrictions, and allergy management
          </p>
        </div>

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

export default FoodPreferencesSection;
