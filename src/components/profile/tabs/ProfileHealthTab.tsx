
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProfileHealthTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Health Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Health assessment form will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileHealthTab;
