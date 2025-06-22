
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

const TraineesTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            My Trainees
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">No trainees assigned yet.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TraineesTab;
