
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, Building2 } from "lucide-react";

interface ExerciseProgramSelectorProps {
  selectedType: 'home' | 'gym';
  onTypeChange: (type: 'home' | 'gym') => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const ExerciseProgramSelector = ({ 
  selectedType, 
  onTypeChange, 
  onGenerate, 
  isGenerating 
}: ExerciseProgramSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Workout Type</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant={selectedType === 'home' ? 'default' : 'outline'}
            onClick={() => onTypeChange('home')}
            className="h-24 flex-col gap-2"
          >
            <Home className="h-6 w-6" />
            <span>Home Workout</span>
            <Badge variant="secondary" className="text-xs">
              No equipment needed
            </Badge>
          </Button>
          <Button
            variant={selectedType === 'gym' ? 'default' : 'outline'}
            onClick={() => onTypeChange('gym')}
            className="h-24 flex-col gap-2"
          >
            <Building2 className="h-6 w-6" />
            <span>Gym Workout</span>
            <Badge variant="secondary" className="text-xs">
              Full equipment access
            </Badge>
          </Button>
        </div>
        <Button 
          onClick={onGenerate} 
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? 'Generating Program...' : 'Generate Exercise Program'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ExerciseProgramSelector;
