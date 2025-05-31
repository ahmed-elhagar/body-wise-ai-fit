
import { Suspense } from 'react';
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import CoachDashboard from "@/components/coach/CoachDashboard";
import { Skeleton } from "@/components/ui/skeleton";

const CoachLoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6">
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
    </div>
  </div>
);

const Coach = () => {
  return (
    <ProtectedRoute requireProfile>
      <Layout>
        <Suspense fallback={<CoachLoadingSkeleton />}>
          <CoachDashboard />
        </Suspense>
      </Layout>
    </ProtectedRoute>
  );
};

export default Coach;
