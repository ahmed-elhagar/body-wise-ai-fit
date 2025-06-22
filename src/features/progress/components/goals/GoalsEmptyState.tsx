
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Plus } from "lucide-react";

export const GoalsEmptyState: React.FC = () => {
  return (
    <Card className="text-center py-8">
      <CardContent>
        <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Goals Set</h3>
        <p className="text-gray-500 mb-4">Start your fitness journey by setting your first goal.</p>
        <Button className="bg-gradient-to-r from-blue-500 to-indigo-600">
          <Plus className="h-4 w-4 mr-2" />
          Set Your First Goal
        </Button>
      </CardContent>
    </Card>
  );
};
