
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Dumbbell, Clock } from "lucide-react";

interface ExerciseProgramSelectorProps {
  programs: any[];
  selectedProgram: any;
  onSelect: (program: any) => void;
  onCreateNew: () => void;
}

export const ExerciseProgramSelector = ({
  programs,
  selectedProgram,
  onSelect,
  onCreateNew
}: ExerciseProgramSelectorProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Exercise Programs</h3>
        <Button onClick={onCreateNew} size="sm">
          Create New Program
        </Button>
      </div>
      
      <div className="space-y-3">
        {programs.map((program) => (
          <div
            key={program.id}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedProgram?.id === program.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onSelect(program)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Dumbbell className="w-5 h-5 text-blue-600" />
                <div>
                  <h4 className="font-medium">{program.program_name}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Week {program.current_week}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{program.workout_type}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <Badge variant={program.difficulty_level === 'beginner' ? 'secondary' : 'default'}>
                {program.difficulty_level}
              </Badge>
            </div>
          </div>
        ))}
        
        {programs.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No exercise programs found</p>
            <Button onClick={onCreateNew} className="mt-2">
              Create Your First Program
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
