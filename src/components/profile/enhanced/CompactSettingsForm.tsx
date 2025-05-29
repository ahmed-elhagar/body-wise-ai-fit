
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Globe, Bell, Shield, Mail, Lock, Save, Settings } from "lucide-react";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { useProfile } from "@/hooks/useProfile";
import { useOnboardingProgress } from "@/hooks/useOnboardingProgress";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CompactSettingsForm = () => {
  const { t, language, setLanguage } = useLanguage();
  const { profile, updateProfile } = useProfile();
  const { markStepComplete } = useOnboardingProgress();
  const { user } = useAuth();
  
  const [preferences, setPreferences] = useState({
    notifications: true,
    emailUpdates: false,
    measurementUnits: 'metric',
  });

  const [emailData, setEmailData] = useState({ newEmail: "" });
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState({ email: false, password: false, prefs: false });

  const handleLanguageChange = async (newLanguage: string) => {
    setLanguage(newLanguage as Language);
    if (profile) {
      await updateProfile({ preferred_language: newLanguage });
      toast.success('Language preference saved!');
    }
  };

  const handleEmailUpdate = async () => {
    if (!emailData.newEmail) {
      toast.error("Please enter a new email address");
      return;
    }

    setLoading(prev => ({ ...prev, email: true }));
    try {
      const { error } = await supabase.auth.updateUser({
        email: emailData.newEmail
      });

      if (error) throw error;
      
      toast.success("Email update initiated. Check both your old and new email for confirmation.");
      setEmailData({ newEmail: "" });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(prev => ({ ...prev, email: false }));
    }
  };

  const handlePasswordUpdate = async () => {
    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(prev => ({ ...prev, password: true }));
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;
      
      toast.success("Password updated successfully!");
      setPasswordData({ newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(prev => ({ ...prev, password: false }));
    }
  };

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
    <div className="space-y-3">
      {/* General Settings */}
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

      {/* Notifications */}
      <Card className="p-3">
        <div className="flex items-center gap-2 mb-3">
          <Bell className="w-4 h-4 text-blue-600" />
          <h3 className="font-semibold text-sm">Notifications</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-xs">Push Notifications</Label>
              <p className="text-xs text-gray-600">Workout and meal reminders</p>
            </div>
            <Switch
              checked={preferences.notifications}
              onCheckedChange={(checked) => setPreferences({...preferences, notifications: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-xs">Email Updates</Label>
              <p className="text-xs text-gray-600">Weekly progress reports</p>
            </div>
            <Switch
              checked={preferences.emailUpdates}
              onCheckedChange={(checked) => setPreferences({...preferences, emailUpdates: checked})}
            />
          </div>
        </div>
      </Card>

      {/* Account Security */}
      <Card className="p-3">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-blue-600" />
          <h3 className="font-semibold text-sm">Account Security</h3>
        </div>
        
        {/* Email Section */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2">
            <Mail className="w-3 h-3" />
            <Label className="text-xs font-medium">Email Settings</Label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Input
              value={user?.email || ""}
              disabled
              placeholder="Current email"
              className="bg-gray-50 h-8 text-xs"
            />
            <Input
              type="email"
              value={emailData.newEmail}
              onChange={(e) => setEmailData({ newEmail: e.target.value })}
              placeholder="New email"
              className="h-8 text-xs"
            />
            <Button
              onClick={handleEmailUpdate}
              disabled={loading.email || !emailData.newEmail}
              size="sm"
              className="h-8 text-xs"
            >
              {loading.email ? 'Updating...' : 'Update Email'}
            </Button>
          </div>
        </div>

        <Separator className="my-2" />

        {/* Password Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Lock className="w-3 h-3" />
            <Label className="text-xs font-medium">Password Settings</Label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
              placeholder="New password"
              className="h-8 text-xs"
            />
            <Input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              placeholder="Confirm password"
              className="h-8 text-xs"
            />
            <Button
              onClick={handlePasswordUpdate}
              disabled={loading.password || !passwordData.newPassword || !passwordData.confirmPassword}
              size="sm"
              className="h-8 text-xs"
            >
              {loading.password ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Save Button */}
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
    </div>
  );
};

export default CompactSettingsForm;
