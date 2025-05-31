
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Shield, Mail, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AccountSecuritySectionProps {
  loading: {
    email: boolean;
    password: boolean;
  };
  setLoading: (loading: any) => void;
}

export const AccountSecuritySection = ({ loading, setLoading }: AccountSecuritySectionProps) => {
  const { user } = useAuth();
  const [emailData, setEmailData] = useState({ newEmail: "" });
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: ""
  });

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

  return (
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
  );
};
