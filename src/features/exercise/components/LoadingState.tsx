
import { Card } from '@/components/ui/card';
import { Loader2, Dumbbell } from 'lucide-react';

const LoadingState = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-fitness-primary-600 to-fitness-primary-700 border-0 shadow-xl rounded-2xl overflow-hidden">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Exercise Program</h1>
              <p className="text-fitness-primary-100 text-sm">Loading your workout plan...</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-fitness-primary-500 mb-4" />
          <p className="text-gray-600 text-center">Loading your exercise program...</p>
        </div>
      </Card>
    </div>
  );
};

export default LoadingState;
