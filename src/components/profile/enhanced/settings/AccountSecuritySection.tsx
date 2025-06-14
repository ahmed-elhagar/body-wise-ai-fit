
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { Card } from "@/components/ui/card";

export const AccountSecuritySection = () => {
  return (
    <Card className="p-3">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="w-4 h-4 text-blue-600" />
        <h3 className="font-semibold text-sm">Account Security</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <Button variant="outline" size="sm" className="text-xs">
          Change Email
        </Button>
        <Button variant="outline" size="sm" className="text-xs">
          Change Password
        </Button>
      </div>
    </Card>
  );
};
