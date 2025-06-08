import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  MessageCircle, 
  BarChart3, 
  Plus,
  Calendar,
  Award,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { TraineesTab } from './TraineesTab';
import { CoachMessagesTab } from './CoachMessagesTab';
import { CoachAnalyticsTab } from './CoachAnalyticsTab';
import { AssignTraineeDialog } from './AssignTraineeDialog';
import { CoachTraineeChat } from './CoachTraineeChat';

interface CoachTraineeRelationship {
  id: string;
  trainee_id: string;
  coach_id: string;
  status: string;
  created_at: string;
  trainee_profile: any;
}

const EnhancedCoachDashboard = () => {
  const { t, isRTL } = useI18n();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('trainees');
  const [trainees, setTrainees] = useState<CoachTraineeRelationship[]>([]);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedTrainee, setSelectedTrainee] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrainees = async () => {
      const { data, error } = await supabase
        .from('coach_trainee_relationships')
        .select('*')
        .eq('coach_id', user?.id || '')
        .order('created_at', { ascending: false });

      if (data) {
        setTrainees(data);
      } else if (error) {
        console.error('Error fetching trainees:', error);
      }
    };

    fetchTrainees();
  }, [user]);

  const handleAssignTrainee = (traineeId: string) => {
    // Handle assignment logic
    setShowAssignDialog(false);
  };

  if (selectedTrainee) {
    return (
      <CoachTraineeChat 
        traineeId={selectedTrainee}
        onBack={() => setSelectedTrainee(null)}
      />
    );
  }

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('coach:dashboard') || 'Coach Dashboard'}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('coach:manageTrainees') || 'Manage your trainees and track their progress'}
          </p>
        </div>
        
        <Button 
          onClick={() => setShowAssignDialog(true)}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
        >
          <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('coach:assignTrainee') || 'Assign Trainee'}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <p className="text-blue-600 text-sm font-medium">{t('coach:totalTrainees') || 'Total Trainees'}</p>
              <p className="text-2xl font-bold text-blue-900">{trainees.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <p className="text-green-600 text-sm font-medium">{t('coach:activeTrainees') || 'Active Today'}</p>
              <p className="text-2xl font-bold text-green-900">
                {trainees.filter(t => t.status === 'active').length}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <p className="text-purple-600 text-sm font-medium">{t('coach:messages') || 'Messages'}</p>
              <p className="text-2xl font-bold text-purple-900">12</p>
            </div>
            <MessageCircle className="w-8 h-8 text-purple-600" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <p className="text-orange-600 text-sm font-medium">{t('coach:achievements') || 'Achievements'}</p>
              <p className="text-2xl font-bold text-orange-900">8</p>
            </div>
            <Award className="w-8 h-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100">
          <TabsTrigger value="trainees" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Users className="w-4 h-4" />
            {t('coach:trainees') || 'Trainees'}
          </TabsTrigger>
          <TabsTrigger value="messages" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <MessageCircle className="w-4 h-4" />
            {t('coach:messages') || 'Messages'}
          </TabsTrigger>
          <TabsTrigger value="analytics" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <BarChart3 className="w-4 h-4" />
            {t('coach:analytics') || 'Analytics'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trainees" className="mt-6">
          <TraineesTab 
            trainees={trainees}
            setSelectedClient={(traineeId: string) => setSelectedTrainee(traineeId)}
          />
        </TabsContent>

        <TabsContent value="messages" className="mt-6">
          <CoachMessagesTab />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <CoachAnalyticsTab />
        </TabsContent>
      </Tabs>

      {/* Assign Trainee Dialog */}
      <AssignTraineeDialog 
        open={showAssignDialog}
        onOpenChange={setShowAssignDialog}
        onAssign={(traineeId: string) => {
          // Handle assignment logic
          setShowAssignDialog(false);
        }}
      />
    </div>
  );
};

export default EnhancedCoachDashboard;
