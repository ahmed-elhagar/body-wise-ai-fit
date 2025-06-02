
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useMealPlanTranslations } from "@/hooks/useMealPlanTranslations";

export const LoadingState = () => {
  const { loading, loadingDescription } = useMealPlanTranslations();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-lg w-full p-8 text-center">
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Loader2 className="w-16 h-16 text-fitness-primary-500 animate-spin" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-fitness-primary-800 mb-2">
              {loading}
            </h3>
            <p className="text-fitness-primary-600">
              {loadingDescription}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
