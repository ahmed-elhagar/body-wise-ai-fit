
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Search } from "lucide-react";
import Layout from "@/components/Layout";
import { FoodScanner, EnhancedSearchTab } from "@/features/food-tracker/components";

const CalorieChecker = () => {
  const [activeTab, setActiveTab] = useState('photo');

  const handleFoodAdded = () => {
    // Refresh or navigate as needed
    console.log('Food added successfully');
  };

  const handleClose = () => {
    // Handle any cleanup if needed
    console.log('Component closed');
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Calorie Checker</h1>
            <p className="text-muted-foreground">
              Analyze food photos or search our comprehensive food database
            </p>
          </div>
        </div>

        <Tabs defaultValue="photo" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="photo" className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              <span>AI Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span>Search</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="photo" className="space-y-6">
            <FoodScanner 
              onFoodAdded={handleFoodAdded}
              onClose={handleClose}
            />
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <EnhancedSearchTab
              onFoodAdded={handleFoodAdded}
              onClose={handleClose}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CalorieChecker;
