
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

const EnhancedStatsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Stats Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Enhanced statistics cards</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedStatsCards;
