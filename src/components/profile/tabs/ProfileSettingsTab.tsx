
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProfileSettingsTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Profile settings will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettingsTab;
