
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LifestyleSectionProps {
  formData: any;
  setFormData: (data: any) => void;
}

const LifestyleSection = ({ formData, setFormData }: LifestyleSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-base lg:text-lg font-semibold text-gray-800">Lifestyle</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="exercise_history">Exercise History</Label>
          <Select 
            value={formData.exercise_history || undefined} 
            onValueChange={(value) => setFormData((prev: any) => ({ ...prev, exercise_history: value }))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner (0-6 months)</SelectItem>
              <SelectItem value="intermediate">Intermediate (6 months - 2 years)</SelectItem>
              <SelectItem value="advanced">Advanced (2+ years)</SelectItem>
              <SelectItem value="athlete">Competitive Athlete</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="cooking_skills">Cooking Skills</Label>
          <Select 
            value={formData.cooking_skills || undefined} 
            onValueChange={(value) => setFormData((prev: any) => ({ ...prev, cooking_skills: value }))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select cooking level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None/Minimal</SelectItem>
              <SelectItem value="basic">Basic</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="time_availability">Time Availability</Label>
          <Select 
            value={formData.time_availability || undefined} 
            onValueChange={(value) => setFormData((prev: any) => ({ ...prev, time_availability: value }))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select time availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="limited">Limited (15-30 min/day)</SelectItem>
              <SelectItem value="moderate">Moderate (30-60 min/day)</SelectItem>
              <SelectItem value="flexible">Flexible (60+ min/day)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="work_schedule">Work Schedule</Label>
          <Select 
            value={formData.work_schedule || undefined} 
            onValueChange={(value) => setFormData((prev: any) => ({ ...prev, work_schedule: value }))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select work schedule" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desk_job">Desk Job (Sedentary)</SelectItem>
              <SelectItem value="active_job">Active Job</SelectItem>
              <SelectItem value="shift_work">Shift Work</SelectItem>
              <SelectItem value="flexible">Flexible Schedule</SelectItem>
              <SelectItem value="unemployed">Unemployed/Student</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="nutrition_knowledge">Nutrition Knowledge</Label>
          <Select 
            value={formData.nutrition_knowledge || undefined} 
            onValueChange={(value) => setFormData((prev: any) => ({ ...prev, nutrition_knowledge: value }))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select nutrition knowledge" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None/Minimal</SelectItem>
              <SelectItem value="basic">Basic</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default LifestyleSection;
