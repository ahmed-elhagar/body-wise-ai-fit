
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Loader2, Calendar, Database, Search } from "lucide-react";

interface AIPreferences {
  duration: string;
  cuisine: string;
  maxPrepTime: string;
  mealTypes: string;
}

interface AIGenerationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: AIPreferences;
  onPreferencesChange: (preferences: AIPreferences) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const AIGenerationDialog = ({ 
  isOpen, 
  onClose, 
  preferences, 
  onPreferencesChange, 
  onGenerate, 
  isGenerating 
}: AIGenerationDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Generate AI Meal Plan
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span className="font-medium text-sm text-purple-800">7-Day Complete Plan</span>
            </div>
            <p className="text-xs text-purple-700">
              • 35 meals total (5 meals × 7 days)
              • Breakfast, lunch, dinner, and 2 snacks daily
              • Personalized to your profile and preferences
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-sm text-blue-800">Food Database Integration</span>
            </div>
            <p className="text-xs text-blue-700">
              • Automatically populates food database
              • Enables quick meal searches
              • Stores nutritional data for future use
            </p>
          </div>

          <div>
            <Label htmlFor="cuisine">Preferred Cuisine (Optional)</Label>
            <Input
              value={preferences.cuisine}
              onChange={(e) => onPreferencesChange({ ...preferences, cuisine: e.target.value })}
              placeholder="e.g., Mediterranean, Asian, Italian"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">Leave empty to use your nationality preference</p>
          </div>
          
          <div>
            <Label htmlFor="maxPrepTime">Max Prep Time (minutes)</Label>
            <Select 
              value={preferences.maxPrepTime} 
              onValueChange={(value) => onPreferencesChange({ ...preferences, maxPrepTime: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={onGenerate} 
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating 7-Day Plan...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate 7-Day Meal Plan
              </>
            )}
          </Button>

          {isGenerating && (
            <div className="text-center space-y-2">
              <div className="text-sm text-gray-600">
                Creating your personalized meal plan...
              </div>
              <div className="text-xs text-gray-500">
                This may take 30-60 seconds
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIGenerationDialog;
