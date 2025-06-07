
import { Tabs } from "@/components/ui/tabs";
import ProfileTabNavigation from "./ProfileTabNavigation";
import ProfileTabContent from "./ProfileTabContent";
import { useState } from "react";

interface RefactoredProfileViewProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  handleArrayInput: (field: string, value: string) => void;
  saveBasicInfo: () => Promise<boolean>;
  saveGoalsAndActivity: () => Promise<boolean>;
  isUpdating: boolean;
  validationErrors: Record<string, string>;
}

const RefactoredProfileView = (props: RefactoredProfileViewProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <ProfileTabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <ProfileTabContent {...props} />
    </Tabs>
  );
};

export default RefactoredProfileView;
