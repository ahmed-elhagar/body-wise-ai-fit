
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

const TraineesTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Trainees Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Trainees management interface will be implemented here.</p>
      </CardContent>
    </Card>
  );
};

export default TraineesTab;
