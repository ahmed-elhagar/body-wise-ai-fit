
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Search, Plus, Filter } from 'lucide-react';
import { useCoachSystem } from '@/features/coach/hooks/useCoachSystem';
import { useLanguage } from '@/contexts/LanguageContext';
import TraineeCard from './TraineeCard';
import TraineeDetailsDialog from './TraineeDetailsDialog';
import AssignTraineeDialog from './AssignTraineeDialog';
import { CoachTraineeRelationship } from '@/features/coach/types/coach.types';

const TraineesTab = () => {
  const { t } = useLanguage();
  const { trainees, isLoadingTrainees } = useCoachSystem();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedTrainee, setSelectedTrainee] = useState<CoachTraineeRelationship | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);

  const filteredTrainees = (trainees || []).filter(trainee => {
    const matchesSearch = !searchTerm || 
      (trainee.trainee_profile?.first_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (trainee.trainee_profile?.last_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (trainee.trainee_profile?.email?.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'active' && (trainee.trainee_profile?.ai_generations_remaining || 0) > 0) ||
      (filterStatus === 'inactive' && (trainee.trainee_profile?.ai_generations_remaining || 0) === 0);

    return matchesSearch && matchesFilter;
  });

  const handleViewDetails = (trainee: CoachTraineeRelationship) => {
    setSelectedTrainee(trainee);
    setShowDetailsDialog(true);
  };

  const handleMessage = (trainee: CoachTraineeRelationship) => {
    // This would typically navigate to the chat interface
    console.log('Message trainee:', trainee);
  };

  if (isLoadingTrainees) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2">{t('Loading trainees...')}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('Trainees Management')}</h2>
          <p className="text-gray-600 mt-1">
            {t('Manage and monitor your assigned trainees')} ({trainees?.length || 0})
          </p>
        </div>
        <Button onClick={() => setShowAssignDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t('Assign Trainee')}
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={t('Search trainees...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'active', 'inactive'] as const).map(status => (
            <Button
              key={status}
              variant={filterStatus === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus(status)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              {t(status.charAt(0).toUpperCase() + status.slice(1))}
            </Button>
          ))}
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <span>{t('Showing')} {filteredTrainees.length} {t('of')} {trainees?.length || 0} {t('trainees')}</span>
        {searchTerm && (
          <Badge variant="secondary">
            {t('Search')}: "{searchTerm}"
          </Badge>
        )}
        {filterStatus !== 'all' && (
          <Badge variant="outline">
            {t('Filter')}: {t(filterStatus)}
          </Badge>
        )}
      </div>

      {/* Trainees Grid */}
      {filteredTrainees.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">
              {searchTerm || filterStatus !== 'all' 
                ? t('No trainees found') 
                : t('No trainees assigned')
              }
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterStatus !== 'all'
                ? t('Try adjusting your search or filter criteria')
                : t('Start by assigning your first trainee to begin coaching')
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <Button onClick={() => setShowAssignDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {t('Assign First Trainee')}
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrainees.map((trainee) => (
            <TraineeCard
              key={trainee.id}
              trainee={trainee}
              onMessage={() => handleMessage(trainee)}
              onViewDetails={() => handleViewDetails(trainee)}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <TraineeDetailsDialog
        trainee={selectedTrainee}
        isOpen={showDetailsDialog}
        onClose={() => {
          setShowDetailsDialog(false);
          setSelectedTrainee(null);
        }}
        onMessage={() => {
          if (selectedTrainee) {
            handleMessage(selectedTrainee);
          }
        }}
      />

      <AssignTraineeDialog
        isOpen={showAssignDialog}
        onClose={() => setShowAssignDialog(false)}
      />
    </div>
  );
};

export default TraineesTab;
