
import React from 'react';
import GoalsOverview from './GoalsOverview';
import GoalCreationDialog from './GoalCreationDialog';

const GoalsDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Goals</h1>
        <GoalCreationDialog />
      </div>
      
      <GoalsOverview />
    </div>
  );
};

export default GoalsDashboard;
