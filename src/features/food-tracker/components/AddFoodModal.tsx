
import React, { useState } from 'react';
import { X, Search, Camera } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FoodSearchTab from './FoodSearchTab';

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Add Food
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
              value="photo"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Camera className="h-4 w-4 mr-2" />
              Photo
            </TabsTrigger>
            <TabsTrigger 
              value="manual"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Manual
            </TabsTrigger>
          </TabsList>

          <div className="mt-6 max-h-[60vh] overflow-y-auto">
            <TabsContent value="search">
              <FoodSearchTab onFoodAdded={handleFoodAdded} />
            </TabsContent>

            <TabsContent value="photo" className="text-center py-12">
              <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Photo Analysis</h3>
              <p className="text-gray-500 mb-6">
                Take a photo of your food to automatically analyze its nutrition
              </p>
              <Button 
                disabled
                className="bg-gradient-to-r from-purple-600 to-pink-600"
              >
                Coming Soon
              </Button>
            </TabsContent>

            <TabsContent value="manual" className="text-center py-12">
              <div className="text-gray-500">
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Manual Entry</h3>
                <p className="mb-6">
                  Manually enter nutrition information for custom foods
                </p>
                <Button 
                  disabled
                  className="bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  Coming Soon
                </Button>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddFoodModal;
