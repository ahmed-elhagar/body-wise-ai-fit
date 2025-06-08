
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  MessageCircle, 
  User, 
  Calendar,
  TrendingUp,
  Filter
} from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface TraineesTabProps {
  trainees: any[];
  setSelectedClient: (clientId: string) => void;
}

export const TraineesTab = ({ trainees, setSelectedClient }: TraineesTabProps) => {
  const { t, isRTL } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredTrainees = trainees.filter(trainee => {
    const matchesSearch = trainee.trainee_profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesFilter = filterStatus === 'all' || trainee.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className={`flex flex-col sm:flex-row gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
        <div className={`relative flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
          <Search className={`absolute top-3 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
          <Input
            placeholder={t('coach:searchTrainees') || 'Search trainees...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`${isRTL ? 'pr-10 text-right' : 'pl-10'}`}
          />
        </div>
        
        <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('all')}
          >
            {t('coach:all') || 'All'}
          </Button>
          <Button
            variant={filterStatus === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('active')}
          >
            {t('coach:active') || 'Active'}
          </Button>
          <Button
            variant={filterStatus === 'inactive' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('inactive')}
          >
            {t('coach:inactive') || 'Inactive'}
          </Button>
        </div>
      </div>

      {/* Trainees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrainees.map((trainee) => (
          <Card key={trainee.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className={`flex items-center gap-4 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                <h3 className="font-semibold text-gray-900">
                  {trainee.trainee_profile?.full_name || 'Unknown User'}
                </h3>
                <Badge 
                  variant={trainee.status === 'active' ? 'default' : 'secondary'}
                  className="mt-1"
                >
                  {trainee.status}
                </Badge>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className={`flex items-center gap-2 text-sm text-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Calendar className="w-4 h-4" />
                <span>{t('coach:joined') || 'Joined'}: {new Date(trainee.created_at).toLocaleDateString()}</span>
              </div>
              <div className={`flex items-center gap-2 text-sm text-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <TrendingUp className="w-4 h-4" />
                <span>{t('coach:progress') || 'Progress'}: 75%</span>
              </div>
            </div>

            <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setSelectedClient(trainee.trainee_id)}
              >
                <MessageCircle className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('coach:chat') || 'Chat'}
              </Button>
              <Button
                variant="default"
                size="sm"
                className="flex-1"
              >
                {t('coach:viewProfile') || 'View Profile'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredTrainees.length === 0 && (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('coach:noTraineesFound') || 'No trainees found'}
          </h3>
          <p className="text-gray-600">
            {searchTerm ? 
              (t('coach:noMatchingTrainees') || 'No trainees match your search criteria') :
              (t('coach:noTraineesYet') || 'You haven\'t been assigned any trainees yet')
            }
          </p>
        </div>
      )}
    </div>
  );
};
