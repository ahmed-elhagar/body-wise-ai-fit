
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dumbbell, Sparkles, Home, Building2 } from 'lucide-react';

interface EmptyProgramStateProps {
  onGenerateProgram: () => void;
  isGenerating?: boolean;
}

const EmptyProgramState = ({ onGenerateProgram, isGenerating }: EmptyProgramStateProps) => {
  return (
    <Card className="p-8">
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-fitness-primary-100 rounded-2xl flex items-center justify-center mb-6">
          <Dumbbell className="w-8 h-8 text-fitness-primary-600" />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Ready to Start Your Fitness Journey?
        </h3>
        
        <p className="text-gray-600 mb-8 max-w-md">
          Let our AI create a personalized workout program tailored to your goals, 
          fitness level, and available equipment.
        </p>

        <div className="flex flex-col gap-4 w-full max-w-sm">
          <Button
            onClick={onGenerateProgram}
            disabled={isGenerating}
            className="bg-fitness-primary-500 hover:bg-fitness-primary-600 text-white h-12"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {isGenerating ? 'Generating Your Program...' : 'Generate AI Workout Plan'}
          </Button>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Home className="w-4 h-4" />
            <span>Works for home or gym workouts</span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 w-full max-w-md text-center">
          <div className="p-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-blue-600 font-bold">AI</span>
            </div>
            <p className="text-xs text-gray-600">Smart recommendations</p>
          </div>
          <div className="p-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Dumbbell className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-xs text-gray-600">Progressive training</p>
          </div>
          <div className="p-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Building2 className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-xs text-gray-600">Flexible locations</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EmptyProgramState;
