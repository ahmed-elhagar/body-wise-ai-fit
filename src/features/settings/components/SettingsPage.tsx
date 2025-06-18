
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Calendar, Utensils, Settings as SettingsIcon } from "lucide-react";
import { GeneralSettingsTab } from './GeneralSettingsTab';
import { HealthSettingsTab } from './HealthSettingsTab';
import { FoodPreferencesTab } from './FoodPreferencesTab';
import { SpecialConditionsTab } from './SpecialConditionsTab';

export const SettingsPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Customize your health profile and preferences</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm">
          <TabsTrigger 
            value="general" 
            className="flex items-center gap-2 data-[state=active]:bg-fitness-primary-600 data-[state=active]:text-white"
          >
            <SettingsIcon className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger 
            value="health" 
            className="flex items-center gap-2 data-[state=active]:bg-fitness-primary-600 data-[state=active]:text-white"
          >
            <Heart className="h-4 w-4" />
            Health
          </TabsTrigger>
          <TabsTrigger 
            value="food" 
            className="flex items-center gap-2 data-[state=active]:bg-fitness-primary-600 data-[state=active]:text-white"
          >
            <Utensils className="h-4 w-4" />
            Food
          </TabsTrigger>
          <TabsTrigger 
            value="conditions" 
            className="flex items-center gap-2 data-[state=active]:bg-fitness-primary-600 data-[state=active]:text-white"
          >
            <Calendar className="h-4 w-4" />
            Conditions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <GeneralSettingsTab />
        </TabsContent>

        <TabsContent value="health" className="mt-6">
          <HealthSettingsTab />
        </TabsContent>

        <TabsContent value="food" className="mt-6">
          <FoodPreferencesTab />
        </TabsContent>

        <TabsContent value="conditions" className="mt-6">
          <SpecialConditionsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
