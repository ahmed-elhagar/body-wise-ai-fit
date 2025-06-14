
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

const AnalyticsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Analytics dashboard coming soon!</p>
      </CardContent>
    </Card>
  );
};

export default AnalyticsTab;
