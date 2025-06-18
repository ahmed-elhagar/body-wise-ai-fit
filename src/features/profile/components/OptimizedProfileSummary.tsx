
import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { useProfileForm } from "../hooks/useProfileForm";
import ProfileTabNavigation from "./ProfileTabNavigation";
import ProfileTabContent from "./ProfileTabContent";

const OptimizedProfileSummary = React.memo(() => {
  const {
    formData,
    updateFormData,
    handleArrayInput,
    saveBasicInfo,
    saveGoalsAndActivity,
    isUpdating,
    validationErrors,
  } = useProfileForm();

  const [activeTab, setActiveTab] = React.useState("overview");

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <ProfileTabNavigation 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
            />
            
            <div className="mt-6">
              <ProfileTabContent
                formData={formData}
                updateFormData={updateFormData}
                handleArrayInput={handleArrayInput}
                saveBasicInfo={saveBasicInfo}
                saveGoalsAndActivity={saveGoalsAndActivity}
                isUpdating={isUpdating}
                validationErrors={validationErrors}
              />
            </div>
          </Tabs>
        </div>
      </Card>
    </div>
  );
});

OptimizedProfileSummary.displayName = 'OptimizedProfileSummary';

export default OptimizedProfileSummary;
