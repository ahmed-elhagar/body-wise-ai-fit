
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Calendar, Utensils, Settings as SettingsIcon } from "lucide-react";
import HealthConditionsSection from './HealthConditionsSection';
import FoodPreferencesSection from './FoodPreferencesSection';
import GeneralSettingsSection from './GeneralSettingsSection';

const ProfileSettingsPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-9brand-neutral-600brand-neutral-600 mb-2">Profile Settings</h1>
        <p className="text-gray-6brand-neutral-600brand-neutral-600">Customize your health profile and preferences</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/8brand-neutral-600 backdrop-blur-sm border border-gray-2brand-neutral-600brand-neutral-600 shadow-sm">
          <TabsTrigger 
            value="general" 
            className="flex items-center gap-2 data-[state=active]:bg-fitness-primary-6brand-neutral-600brand-neutral-600 data-[state=active]:text-white"
          >
            <SettingsIcon className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger 
            value="health" 
            className="flex items-center gap-2 data-[state=active]:bg-fitness-primary-6brand-neutral-600brand-neutral-600 data-[state=active]:text-white"
          >
            <Heart className="h-4 w-4" />
            Health
          </TabsTrigger>
          <TabsTrigger 
            value="conditions" 
            className="flex items-center gap-2 data-[state=active]:bg-fitness-primary-6brand-neutral-600brand-neutral-600 data-[state=active]:text-white"
          >
            <Calendar className="h-4 w-4" />
            Conditions
          </TabsTrigger>
          <TabsTrigger 
            value="food" 
            className="flex items-center gap-2 data-[state=active]:bg-fitness-primary-6brand-neutral-600brand-neutral-600 data-[state=active]:text-white"
          >
            <Utensils className="h-4 w-4" />
            Food
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <GeneralSettingsSection />
        </TabsContent>

        <TabsContent value="health" className="mt-6">
          <HealthConditionsSection />
        </TabsContent>

        <TabsContent value="conditions" className="mt-6">
          <div className="p-4 bg-white rounded-lg border">
            <p>Special conditions settings will be implemented in Phase 2</p>
          </div>
        </TabsContent>

        <TabsContent value="food" className="mt-6">
          <FoodPreferencesSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileSettingsPage;
