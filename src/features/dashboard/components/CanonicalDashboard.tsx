
import React from 'react';
import DashboardHeader from './DashboardHeader';
import { Card } from '@/components/ui/card';

interface CanonicalDashboardProps {
  user: any;
  profile: any;
}

const CanonicalDashboard: React.FC<CanonicalDashboardProps> = ({ user, profile }) => {
  return (
    <div className="p-6 space-y-6">
      <DashboardHeader user={user} profile={profile} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <p className="text-gray-600">Access your most used features</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <p className="text-gray-600">See your latest progress</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Goals</h3>
          <p className="text-gray-600">Track your fitness goals</p>
        </Card>
      </div>
    </div>
  );
};

export default CanonicalDashboard;
