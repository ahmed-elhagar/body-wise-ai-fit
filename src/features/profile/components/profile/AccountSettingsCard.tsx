
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AccountSettingsCardProps {
  user: any;
}

const AccountSettingsCard = ({ user }: AccountSettingsCardProps) => {
  const [emailData, setEmailData] = useState({ newEmail: "" });
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [emailLoading, setEmailLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleEmailUpdate = async () => {
    if (!emailData.newEmail) {
      toast.error("Please enter a new email address");
      return;
    }

    setEmailLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        email: emailData.newEmail
      });

      if (error) throw error;
      
      toast.success("Email update initiated. Please check both your old and new email for confirmation.");
      setEmailData({ newEmail: "" });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setEmailLoading(false);
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

    setPasswordLoading(true);
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
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Email Settings */}
      <Card className="p-6 bg-white/8brand-neutral-600 backdrop-blur-sm border-brand-neutral-600 shadow-lg">
        <div className="flex items-center mb-6">
          <Mail className="w-5 h-5 text-fitness-primary mr-2" />
          <h3 className="text-lg font-semibold text-gray-8brand-neutral-600brand-neutral-600">Email Settings</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="current_email">Current Email</Label>
            <Input
              id="current_email"
              value={user?.email || ""}
              disabled
              className="bg-gray-5brand-neutral-600 mt-1"
            />
          </div>
          <div>
            <Label htmlFor="new_email">New Email Address</Label>
            <Input
              id="new_email"
              type="email"
              value={emailData.newEmail}
              onChange={(e) => setEmailData({ newEmail: e.target.value })}
              placeholder="Enter new email address"
              className="mt-1"
            />
          </div>
          <Button
            onClick={handleEmailUpdate}
            disabled={emailLoading || !emailData.newEmail}
            className="bg-fitness-gradient hover:opacity-9brand-neutral-600 text-white"
          >
            {emailLoading ? 'Updating...' : 'Update Email'}
          </Button>
          <p className="text-sm text-gray-6brand-neutral-600brand-neutral-600">
            You'll receive confirmation emails at both your current and new email addresses.
          </p>
        </div>
      </Card>

      {/* Password Settings */}
      <Card className="p-6 bg-white/8brand-neutral-600 backdrop-blur-sm border-brand-neutral-600 shadow-lg">
        <div className="flex items-center mb-6">
          <Lock className="w-5 h-5 text-fitness-primary mr-2" />
          <h3 className="text-lg font-semibold text-gray-8brand-neutral-600brand-neutral-600">Password Settings</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="new_password">New Password</Label>
            <Input
              id="new_password"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
              placeholder="Enter new password"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="confirm_password">Confirm New Password</Label>
            <Input
              id="confirm_password"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              placeholder="Confirm new password"
              className="mt-1"
            />
          </div>
          <Button
            onClick={handlePasswordUpdate}
            disabled={passwordLoading || !passwordData.newPassword || !passwordData.confirmPassword}
            className="bg-fitness-gradient hover:opacity-9brand-neutral-600 text-white"
          >
            {passwordLoading ? 'Updating...' : 'Update Password'}
          </Button>
          <p className="text-sm text-gray-6brand-neutral-600brand-neutral-600">
            Password must be at least 6 characters long.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AccountSettingsCard;
