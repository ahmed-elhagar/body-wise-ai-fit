
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Bell, Shield, Mail, Lock, Save } from "lucide-react";
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
    <div className="space-y-4">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Account
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-4">
          <Card className="p-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="language">Language</Label>
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="units">Measurement Units</Label>
                <Select 
                  value={preferences.measurementUnits} 
                  onValueChange={(value) => setPreferences({...preferences, measurementUnits: value})}
                >
                  <SelectTrigger className="mt-1">
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
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">Push Notifications</Label>
                  <p className="text-sm text-gray-600">Workout and meal reminders</p>
                </div>
                <Switch
                  id="notifications"
                  checked={preferences.notifications}
                  onCheckedChange={(checked) => setPreferences({...preferences, notifications: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailUpdates">Email Updates</Label>
                  <p className="text-sm text-gray-600">Weekly progress reports</p>
                </div>
                <Switch
                  id="emailUpdates"
                  checked={preferences.emailUpdates}
                  onCheckedChange={(checked) => setPreferences({...preferences, emailUpdates: checked})}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-4 mt-4">
          {/* Email Settings */}
          <Card className="p-4">
            <div className="flex items-center mb-3">
              <Mail className="w-4 h-4 text-blue-600 mr-2" />
              <h3 className="font-semibold">Email Settings</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="current_email" className="text-sm">Current Email</Label>
                <Input
                  id="current_email"
                  value={user?.email || ""}
                  disabled
                  className="bg-gray-50 mt-1 text-sm"
                />
              </div>
              <div>
                <Label htmlFor="new_email" className="text-sm">New Email</Label>
                <Input
                  id="new_email"
                  type="email"
                  value={emailData.newEmail}
                  onChange={(e) => setEmailData({ newEmail: e.target.value })}
                  placeholder="Enter new email"
                  className="mt-1 text-sm"
                />
              </div>
              <Button
                onClick={handleEmailUpdate}
                disabled={loading.email || !emailData.newEmail}
                size="sm"
                className="w-full"
              >
                {loading.email ? 'Updating...' : 'Update Email'}
              </Button>
            </div>
          </Card>

          {/* Password Settings */}
          <Card className="p-4">
            <div className="flex items-center mb-3">
              <Lock className="w-4 h-4 text-blue-600 mr-2" />
              <h3 className="font-semibold">Password Settings</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="new_password" className="text-sm">New Password</Label>
                <Input
                  id="new_password"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Enter new password"
                  className="mt-1 text-sm"
                />
              </div>
              <div>
                <Label htmlFor="confirm_password" className="text-sm">Confirm Password</Label>
                <Input
                  id="confirm_password"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm new password"
                  className="mt-1 text-sm"
                />
              </div>
              <Button
                onClick={handlePasswordUpdate}
                disabled={loading.password || !passwordData.newPassword || !passwordData.confirmPassword}
                size="sm"
                className="w-full"
              >
                {loading.password ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Preferences Button */}
      <div className="flex justify-end pt-4">
        <Button 
          onClick={handleSavePreferences}
          disabled={loading.prefs}
          className="bg-fitness-gradient hover:opacity-90"
        >
          {loading.prefs ? (
            <>
              <Save className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Preferences
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CompactSettingsForm;
