
import React from 'react';
import GoalsDashboard from './GoalsDashboard';

const GoalsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="container mx-auto px-4 py-6">
        <GoalsDashboard />
      </div>
    </div>
  );
};

export default GoalsPage;
