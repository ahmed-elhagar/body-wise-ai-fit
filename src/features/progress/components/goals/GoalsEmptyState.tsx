
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Plus, Sparkles } from "lucide-react";
import { useNavigate } from 'react-router-dom';

export const GoalsEmptyState: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl text-center py-12">
      <CardContent>
        <div className="space-y-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto">
            <Target className="h-12 w-12 text-blue-500" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Goals Set Yet</h3>
            <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
              Start your fitness journey by setting your first goal. Track your progress and achieve amazing results!
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={() => navigate('/goals')}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 px-6 py-3"
            >
              <Plus className="h-4 w-4 mr-2" />
              Set Your First Goal
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/goals')}
              className="border-blue-200 text-blue-600 hover:bg-blue-50 px-6 py-3"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Explore Goal Templates
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
