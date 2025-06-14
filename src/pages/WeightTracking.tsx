import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Scale, Download, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useWeightTracking } from "@/features/dashboard/hooks/useWeightTracking";
import WeightEntryForm from "@/components/weight/WeightEntryForm";
import WeightProgressChart from "@/components/weight/WeightProgressChart";
import WeightStatsCards from "@/components/weight/WeightStatsCards";

const WeightTrackingPage = () => {
  const { entries, refetch } = useWeightTracking();
  const [open, setOpen] = useState(false);

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto py-10">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold">Weight Tracking</h1>
              <p className="text-gray-500">Monitor your weight progress over time.</p>
            </div>
            <Button onClick={() => setOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Weight Entry
            </Button>
          </div>

          <WeightStatsCards />
          <WeightProgressChart weightEntries={entries} />

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              {/* This trigger is hidden, the main button is used instead */}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Weight Entry</DialogTitle>
              </DialogHeader>
              <WeightEntryForm onSuccess={() => {
                setOpen(false);
                refetch();
              }} />
            </DialogContent>
          </Dialog>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default WeightTrackingPage;
