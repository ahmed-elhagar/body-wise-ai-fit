
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scale, Plus } from "lucide-react";

const WeightTracking = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="h-5 w-5" />
          Weight Tracking
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-6">
          <Scale className="h-10 w-10 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Weight Data</h3>
          <p className="text-gray-500 mb-4">Start tracking your weight to see progress over time.</p>
          <Button className="bg-gradient-to-r from-blue-500 to-indigo-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Weight Entry
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeightTracking;
