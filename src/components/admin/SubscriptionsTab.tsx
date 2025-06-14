
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

const SubscriptionsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Subscriptions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Subscription management coming soon!</p>
      </CardContent>
    </Card>
  );
};

export default SubscriptionsTab;
