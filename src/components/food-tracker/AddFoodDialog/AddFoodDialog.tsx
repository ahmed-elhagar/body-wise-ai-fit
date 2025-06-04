
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Camera, Edit3 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import SearchTab from "./SearchTab";
import ScanTab from "./ScanTab";
import ManualTab from "./ManualTab";

interface AddFoodDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onFoodAdded: () => void;
  preSelectedFood?: any;
}

const AddFoodDialog = ({ isOpen, onClose, onFoodAdded, preSelectedFood }: AddFoodDialogProps) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("search");

  useEffect(() => {
    if (preSelectedFood && isOpen) {
      // If we have pre-selected food from AI analysis, switch to manual tab
      setActiveTab("manual");
    } else {
      // Reset to search tab for normal usage
      setActiveTab("search");
    }
  }, [preSelectedFood, isOpen]);

  // If we have pre-selected food, show only the manual tab content
  if (preSelectedFood) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              {t('Add Analyzed Food')}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4 max-h-[70vh] overflow-y-auto">
            <ManualTab 
              onFoodAdded={onFoodAdded} 
              onClose={onClose} 
              preSelectedFood={preSelectedFood}
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            {t('Add Food')}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100">
            <TabsTrigger 
              value="search" 
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              {t('Search')}
            </TabsTrigger>
            <TabsTrigger 
              value="scan" 
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              {t('Scan')}
            </TabsTrigger>
            <TabsTrigger 
              value="manual" 
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              {t('Manual')}
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 max-h-[70vh] overflow-y-auto">
            <TabsContent value="search">
              <SearchTab onFoodAdded={onFoodAdded} onClose={onClose} />
            </TabsContent>

            <TabsContent value="scan">
              <ScanTab onFoodAdded={onFoodAdded} onClose={onClose} />
            </TabsContent>

            <TabsContent value="manual">
              <ManualTab 
                onFoodAdded={onFoodAdded} 
                onClose={onClose} 
                preSelectedFood={preSelectedFood}
              />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddFoodDialog;
