
import React from "react";
import { Card } from "@/components/ui/card";
import { useOptimizedProfile } from "@/hooks/useOptimizedProfile";
import ProfileTabNavigation from "./ProfileTabNavigation";

const OptimizedProfileSummary = React.memo(() => {
  const {
    formData,
    updateFormData,
    handleArrayInput,
    saveBasicInfo,
    saveGoalsAndActivity,
    isUpdating,
  } = useOptimizedProfile();

  const [activeTab, setActiveTab] = React.useState("overview");

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
        <div className="p-6">
          <ProfileTabNavigation 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
          
          <div className="mt-6">
            <div>Profile content will be implemented here</div>
          </div>
        </div>
      </Card>
    </div>
  );
});

OptimizedProfileSummary.displayName = 'OptimizedProfileSummary';

export default OptimizedProfileSummary;
