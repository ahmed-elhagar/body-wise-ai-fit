
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useOnboardingProgress } from "@/hooks/useOnboardingProgress";
import { toast } from "sonner";

interface SettingsFormActionsProps {
  loading: {
    prefs: boolean;
  };
  setLoading: (loading: any) => void;
}

export const SettingsFormActions = ({ loading, setLoading }: SettingsFormActionsProps) => {
  const { markStepComplete } = useOnboardingProgress();

  const handleSavePreferences = async () => {
    setLoading(prev => ({ ...prev, prefs: true }));
    try {
      await markStepComplete('preferences');
      toast.success('Preferences saved successfully!');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
    } finally {
      setLoading(prev => ({ ...prev, prefs: false }));
    }
  };

  return (
    <div className="flex justify-end">
      <Button 
        onClick={handleSavePreferences}
        disabled={loading.prefs}
        className="bg-fitness-gradient hover:opacity-90 h-8 px-4 text-sm"
      >
        {loading.prefs ? (
          <>
            <Save className="w-3 h-3 mr-1 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-3 h-3 mr-1" />
            Save Preferences
          </>
        )}
      </Button>
    </div>
  );
};
