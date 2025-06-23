
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Camera, Plus } from 'lucide-react';
import FoodSearchTab from './FoodSearchTab';
import ManualTab from './ManualTab';
import PhotoScanTab from './PhotoScanTab';

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFoodAdded: () => void;
}

const AddFoodModal: React.FC<AddFoodModalProps> = ({
  isOpen,
  onClose,
  onFoodAdded
}) => {
  const [activeTab, setActiveTab] = useState('search');

  const handleFoodAdded = () => {
    onFoodAdded();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Add Food to Log
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100">
            <TabsTrigger 
              value="search"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </TabsTrigger>
            <TabsTrigger 
              value="scan"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Camera className="h-4 w-4 mr-2" />
              Scan Photo
            </TabsTrigger>
            <TabsTrigger 
              value="manual"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Manual Entry
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="mt-6">
            <FoodSearchTab onFoodAdded={handleFoodAdded} />
          </TabsContent>

          <TabsContent value="scan" className="mt-6">
            <PhotoScanTab onFoodAdded={handleFoodAdded} onClose={onClose} />
          </TabsContent>

          <TabsContent value="manual" className="mt-6">
            <ManualTab onFoodAdded={handleFoodAdded} onClose={onClose} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddFoodModal;
