
import { Skeleton } from "@/components/ui/skeleton";

const ExercisePageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Enhanced Header Skeleton */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-32" />
              </div>
            </div>
            
            {/* Week Navigation Skeleton */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-10 w-10 rounded" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-10 rounded" />
            </div>
          </div>
        </div>

        {/* Layout Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Progress Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="text-center space-y-4">
                  <Skeleton className="h-24 w-24 rounded-full mx-auto" />
                  <Skeleton className="h-6 w-20 mx-auto" />
                  <Skeleton className="h-4 w-32 mx-auto" />
                </div>
              </div>
              
              {/* Motivation Card Skeleton */}
              <div className="bg-gradient-to-br from-fitness-primary-50 to-fitness-secondary-50 rounded-2xl border border-fitness-primary-200 p-6">
                <div className="text-center space-y-3">
                  <Skeleton className="h-12 w-12 rounded-xl mx-auto" />
                  <Skeleton className="h-5 w-24 mx-auto" />
                  <Skeleton className="h-4 w-40 mx-auto" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="lg:col-span-4 space-y-6">
            {/* Day Tabs Skeleton */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-4">
                <div className="flex gap-2 justify-center">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-16 rounded-xl" />
                  ))}
                </div>
              </div>
            </div>

            {/* Exercise List Skeleton */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6">
                <Skeleton className="h-6 w-32 mb-6" />
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="border rounded-xl p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <Skeleton className="h-5 w-40 mb-2" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-8 w-8 rounded" />
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <Skeleton className="h-3 w-8 mb-1" />
                          <Skeleton className="h-6 w-12" />
                        </div>
                        <div>
                          <Skeleton className="h-3 w-8 mb-1" />
                          <Skeleton className="h-6 w-12" />
                        </div>
                        <div>
                          <Skeleton className="h-3 w-12 mb-1" />
                          <Skeleton className="h-6 w-16" />
                        </div>
                      </div>
                      <Skeleton className="h-9 w-full rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExercisePageSkeleton;
