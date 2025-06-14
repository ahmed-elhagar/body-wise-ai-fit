
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

const CoachesTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Coaches Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Coach management features coming soon!</p>
      </CardContent>
    </Card>
  );
};

export default CoachesTab;
