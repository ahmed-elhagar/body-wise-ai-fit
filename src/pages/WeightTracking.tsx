
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Scale } from "lucide-react";
import { WeightEntryForm, WeightProgressChart, WeightStatsCards } from "@/features/weight-tracking";
import { useState } from "react";

interface WeightEntry {
  id: string;
  weight: number;
  recorded_at: string;
}

const WeightTracking = () => {
  const [weightEntries] = useState<WeightEntry[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleWeightAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
          <PageHeader
            title="Weight Tracking"
            description="Track your weight progress over time"
            icon={<Scale className="h-6 w-6 text-blue-600" />}
          />
          
          <div className="px-6 pb-8 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <WeightEntryForm onSuccess={handleWeightAdded} />
              </div>
              <div className="lg:col-span-2">
                <WeightProgressChart weightEntries={weightEntries} />
              </div>
            </div>
            
            <WeightStatsCards weightEntries={weightEntries} />
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default WeightTracking;
