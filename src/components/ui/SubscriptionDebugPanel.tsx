
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SubscriptionDebugPanel = () => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Subscription Debug</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Status:</span>
            <Badge variant="secondary">Development</Badge>
          </div>
          <div className="flex justify-between">
            <span>Plan:</span>
            <span>Pro</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionDebugPanel;
