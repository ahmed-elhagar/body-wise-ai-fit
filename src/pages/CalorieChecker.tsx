import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Search, History } from "lucide-react";
import Layout from "@/components/Layout";
import FoodPhotoAnalyzer from "@/components/calorie/FoodPhotoAnalyzer";

const CalorieChecker = () => {
  const [activeTab, setActiveTab] = useState('photo');

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Calorie Checker</h1>
            <p className="text-muted-foreground">
              Analyze food photos or search for nutritional information
            </p>
          </div>
        </div>

        <Tabs defaultValue="photo" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="photo" className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              <span>Photo Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span>Search</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              <span>History</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="photo" className="space-y-6">
            <FoodPhotoAnalyzer />
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Food Database Search</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Search functionality coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Food Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <p>History functionality coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CalorieChecker;
