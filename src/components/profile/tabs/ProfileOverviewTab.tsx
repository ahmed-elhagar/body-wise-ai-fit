
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProfileOverviewTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Your profile overview will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileOverviewTab;
