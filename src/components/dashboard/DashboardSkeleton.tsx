
import { Skeleton } from "@/components/ui/skeleton";

const DashboardSkeleton = () => {
  return (
    <div className="p-3 md:p-4 lg:p-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header Skeleton */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 border-0 shadow-xl rounded-2xl">
          <div className="relative p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-8 w-48 bg-white/20" />
                <Skeleton className="h-4 w-32 bg-white/10" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-10 rounded bg-white/20" />
                <Skeleton className="h-10 w-10 rounded bg-white/20" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-6 rounded" />
              </div>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>
        
        {/* Progress Chart Skeleton */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-64 w-full rounded" />
        </div>
        
        {/* 50-50 Layout Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Left Column */}
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <Skeleton className="h-6 w-24 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-32 w-full rounded" />
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <Skeleton className="h-6 w-28 mb-4" />
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
