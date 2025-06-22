import React from 'react';
import { Scale, TrendingUp } from 'lucide-react';
import Layout from '@/components/Layout';

const WeightTracking = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-brand-primary-50 to-brand-secondary-50 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-brand-neutral-900 flex items-center gap-3 mb-4">
            <Scale className="h-8 w-8 text-brand-primary-500" />
            Weight Tracking
          </h1>
          <p className="text-brand-neutral-600 mb-8">
            Track your weight progress over time.
          </p>
          
          <div className="text-center py-20">
            <TrendingUp className="h-24 w-24 text-brand-neutral-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-brand-neutral-600 mb-2">
              Weight Tracking Dashboard
            </h3>
            <p className="text-brand-neutral-500">
              Your weight tracking dashboard will be available here.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WeightTracking;
