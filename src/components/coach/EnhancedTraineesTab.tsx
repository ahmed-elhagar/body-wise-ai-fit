
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Search, Plus, Filter } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import TraineeCard from './TraineeCard';
import AssignTraineeDialog from './AssignTraineeDialog';

interface Trainee {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  lastActivity: string;
  progress: number;
  goal: string;
}

interface EnhancedTraineesTabProps {
  trainees: Trainee[];
  onTraineeSelect: (traineeId: string) => void;
  onMessageTrainee: (traineeId: string) => void;
}

const EnhancedTraineesTab = ({ 
  trainees, 
  onTraineeSelect, 
  onMessageTrainee 
}: EnhancedTraineesTabProps) => {
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAssignDialog, setShowAssignDialog] = useState(false);

  const filteredTrainees = trainees.filter(trainee => {
    const matchesSearch = trainee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trainee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || trainee.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: trainees.length,
    active: trainees.filter(t => t.status === 'active').length,
    inactive: trainees.filter(t => t.status === 'inactive').length,
    pending: trainees.filter(t => t.status === 'pending').length
  };

  const handleAssignTrainee = (traineeData: any) => {
    // Handle assigning new trainee
    console.log('Assigning trainee:', traineeData);
    setShowAssignDialog(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              {t('coach:myTrainees')}
              <Badge variant="outline">{trainees.length}</Badge>
            </CardTitle>
            <Button onClick={() => setShowAssignDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              {t('coach:assignTrainee')}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder={t('coach:searchTrainees')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              {t('coach:filter')}
            </Button>
          </div>

          {/* Status Filters */}
          <div className="flex gap-2">
            {Object.entries(statusCounts).map(([status, count]) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(status)}
                className="flex items-center gap-2"
              >
                {t(`coach:status.${status}`)}
                <Badge variant="secondary" className="ml-1">
                  {count}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trainees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrainees.map((trainee) => (
          <TraineeCard
            key={trainee.id}
            trainee={trainee}
            onMessage={onMessageTrainee}
            onViewDetails={onTraineeSelect}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredTrainees.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all' 
                ? t('coach:noTraineesFound') 
                : t('coach:noTraineesYet')
              }
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all'
                ? t('coach:adjustFilters')
                : t('coach:startByAssigning')
              }
            </p>
            <Button onClick={() => setShowAssignDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              {t('coach:assignFirstTrainee')}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Assign Trainee Dialog */}
      <AssignTraineeDialog
        open={showAssignDialog}
        onOpenChange={setShowAssignDialog}
        onAssign={handleAssignTrainee}
      />
    </div>
  );
};

export default EnhancedTraineesTab;
