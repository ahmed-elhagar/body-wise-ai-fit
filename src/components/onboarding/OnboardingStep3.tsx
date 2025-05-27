
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Heart } from "lucide-react";

interface OnboardingStep3Props {
  handleArrayInput: (field: string, value: string) => void;
}

const OnboardingStep3 = ({ handleArrayInput }: OnboardingStep3Props) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-fitness-gradient rounded-full mb-4">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Nutrition Preferences</h2>
        <p className="text-gray-600">Tell us about your dietary preferences (Optional)</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="allergies">Food Allergies</Label>
          <Input
            id="allergies"
            placeholder="e.g., nuts, dairy, gluten (comma-separated)"
            onChange={(e) => handleArrayInput("allergies", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="preferred_foods">Preferred Foods</Label>
          <Textarea
            id="preferred_foods"
            placeholder="Foods you enjoy eating (comma-separated)"
            onChange={(e) => handleArrayInput("preferred_foods", e.target.value)}
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="dietary_restrictions">Dietary Restrictions</Label>
          <Input
            id="dietary_restrictions"
            placeholder="e.g., vegetarian, vegan, keto (comma-separated)"
            onChange={(e) => handleArrayInput("dietary_restrictions", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default OnboardingStep3;
