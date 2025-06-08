
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/hooks/useI18n";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";

interface GeneralSettingsSectionProps {
  preferences: {
    measurementUnits: string;
  };
  setPreferences: (prefs: any) => void;
}

export const GeneralSettingsSection = ({ preferences, setPreferences }: GeneralSettingsSectionProps) => {
  const { language, changeLanguage } = useI18n();
  const { profile, updateProfile } = useProfile();

  const handleLanguageChange = async (newLanguage: string) => {
    await changeLanguage(newLanguage as any);
    if (profile) {
      await updateProfile({ preferred_language: newLanguage });
      toast.success('Language preference saved!');
    }
  };

  return (
    <Card className="p-3">
      <div className="flex items-center gap-2 mb-3">
        <Settings className="w-4 h-4 text-blue-600" />
        <h3 className="font-semibold text-sm">General Settings</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Label className="text-xs">Language</Label>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ar">العربية</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="text-xs">Measurement Units</Label>
          <Select 
            value={preferences.measurementUnits} 
            onValueChange={(value) => setPreferences({...preferences, measurementUnits: value})}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="metric">Metric (kg, cm)</SelectItem>
              <SelectItem value="imperial">Imperial (lbs, ft)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};
