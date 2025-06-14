import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AddFoodDialog, TodayTab, HistoryTab, EnhancedMacroWheel, FoodLogTimeline, MobileOptimizedHeader } from "@/features/food-tracker";
import { useI18n } from "@/hooks/useI18n";

const FoodTracker = () => {
  const [open, setOpen] = React.useState(false);
  const { tFrom } = useI18n();
  const tFoodTracker = tFrom('foodTracker');

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 p-6">
          <div className="md:hidden">
            <MobileOptimizedHeader onAddFood={() => setOpen(true)} />
          </div>

          <Tabs defaultvalue="today" className="space-y-4">
            <TabsList>
              <TabsTrigger value="today">{String(tFoodTracker('today'))}</TabsTrigger>
              <TabsTrigger value="history">{String(tFoodTracker('history'))}</TabsTrigger>
              <TabsTrigger value="trends">{String(tFoodTracker('trends'))}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="today" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>{String(tFoodTracker('foodLog'))}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <FoodLogTimeline />
                    </CardContent>
                  </Card>
                </div>
                
                <EnhancedMacroWheel />
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="space-y-4">
              <HistoryTab />
            </TabsContent>
            
            <TabsContent value="trends">
              <p>Coming soon...</p>
            </TabsContent>
          </Tabs>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="md:block hidden fixed bottom-6 right-6 z-50">
                <Plus className="w-4 h-4 mr-2" />
                {String(tFoodTracker('addFood'))}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{String(tFoodTracker('addFood'))}</DialogTitle>
              </DialogHeader>
              <AddFoodDialog onFoodAdd={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default FoodTracker;
