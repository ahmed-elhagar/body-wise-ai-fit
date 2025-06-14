
import React from 'react';
import { FoodScanner } from "@/features/food-tracker/components";

const FoodPhotoAnalyzer = () => {
  const handleFoodAdded = () => {
    console.log('Food added from legacy analyzer');
  };

  const handleClose = () => {
    console.log('Legacy analyzer closed');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <FoodScanner 
        onFoodAdded={handleFoodAdded}
        onClose={handleClose}
      />
    </div>
  );
};

export default FoodPhotoAnalyzer;
