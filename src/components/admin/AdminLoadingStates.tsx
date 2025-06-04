
import React from "react";
import { Loader2 } from "lucide-react";

interface AdminLoadingStatesProps {
  isLoading: boolean;
  loadingText?: string;
}

export const AdminLoadingStates = ({ 
  isLoading, 
  loadingText = "Processing..." 
}: AdminLoadingStatesProps) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-xl p-8 max-w-md mx-4">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <div className="text-center">
            <h3 className="text-lg font-semibold text-purple-700 mb-2">
              Admin Action
            </h3>
            <p className="text-purple-600">
              {loadingText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoadingStates;
