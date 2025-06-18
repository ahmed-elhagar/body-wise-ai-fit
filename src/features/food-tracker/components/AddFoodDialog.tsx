
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Edit3, Camera } from "lucide-react";
import SearchTab from './SearchTab';
import ManualTab from './ManualTab';
import ScanTab from './ScanTab';

interface AddFoodDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onFoodAdded: () => void;
  preSelectedFood?: any;
}

const AddFoodDialog = ({ isOpen, onClose, onFoodAdded, preSelectedFood }: AddFoodDialogProps) => {
  const [activeTab, setActiveTab] = React.useState("search");

  React.useEffect(() => {
    if (preSelectedFood && isOpen) {
      setActiveTab("manual");
    } else {
      setActiveTab("search");
    }
  }, [preSelectedFood, isOpen]);

  if (preSelectedFood) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              Add Analyzed Food
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
            Add Food
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100">
            <TabsTrigger 
              value="search" 
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Search
            </TabsTrigger>
            <TabsTrigger 
              value="scan" 
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              Scan
            </TabsTrigger>
            <TabsTrigger 
              value="manual" 
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Manual
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
