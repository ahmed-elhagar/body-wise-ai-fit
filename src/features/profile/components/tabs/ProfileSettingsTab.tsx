
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { ProfileSettingsPage } from "../settings";

const ProfileSettingsTab = () => {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white via-gray-50/30 to-slate-50/20">
        <CardHeader className="bg-gradient-to-r from-gray-600/5 to-slate-600/5 border-b border-gray-100/50">
          <CardTitle className="flex items-center gap-3 text-xl font-semibold">
            <div className="p-3 bg-gradient-to-br from-gray-500 to-slate-600 rounded-xl shadow-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="bg-gradient-to-r from-gray-600 to-slate-600 bg-clip-text text-transparent">
                Account Settings
              </span>
              <p className="text-sm text-gray-500 font-normal mt-1">
                Manage your account preferences and privacy settings
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ProfileSettingsPage />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettingsTab;
