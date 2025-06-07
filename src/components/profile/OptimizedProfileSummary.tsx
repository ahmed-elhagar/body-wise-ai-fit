
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";
import ProfileTabContent from "./ProfileTabContent";

const OptimizedProfileSummary = () => {
  const { profile, isLoading } = useProfile();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Profile...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <ProfileTabContent tabId="overview" />
    </div>
  );
};

export default OptimizedProfileSummary;
