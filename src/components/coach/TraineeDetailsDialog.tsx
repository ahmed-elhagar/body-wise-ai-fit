import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User, 
  Calendar, 
  Target, 
  TrendingUp, 
  Activity,
  MessageSquare,
  Edit3,
  Mail,
  Phone,
  MapPin,
  Clock
} from "lucide-react";
import { useCoachSystem, type CoachTraineeRelationship } from "@/hooks/useCoachSystem";
import { formatDistanceToNow, format } from "date-fns";
import { UpdateNotesDialog } from "./UpdateNotesDialog";
import { useI18n } from "@/hooks/useI18n";

interface TraineeDetailsDialogProps {
  trainee: CoachTraineeRelationship;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TraineeDetailsDialog = ({ trainee, open, onOpenChange }: TraineeDetailsDialogProps) => {
  const { language } = useI18n();
  const [showNotesDialog, setShowNotesDialog] = useState(false);

  const profile = trainee.trainee_profile;
  const initials = `${profile?.first_name?.[0] || ''}${profile?.last_name?.[0] || ''}`.toUpperCase();

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              {language === 'ar' ? 'تفاصيل المتدرب' : 'Trainee Details'}
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList>
              <TabsTrigger value="profile">{language === 'ar' ? 'الملف الشخصي' : 'Profile'}</TabsTrigger>
              <TabsTrigger value="activity">{language === 'ar' ? 'النشاط' : 'Activity'}</TabsTrigger>
              <TabsTrigger value="notes">{language === 'ar' ? 'الملاحظات' : 'Notes'}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-2">
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'ar' ? 'معلومات أساسية' : 'Basic Information'}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-14 w-14">
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-lg font-semibold">
                        {profile?.first_name} {profile?.last_name}
                      </p>
                      <p className="text-sm text-gray-500">{profile?.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {profile?.age && (
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>{language === 'ar' ? 'العمر' : 'Age'}: {profile.age}</span>
                      </div>
                    )}
                    {profile?.gender && (
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>{language === 'ar' ? 'الجنس' : 'Gender'}: {profile.gender}</span>
                      </div>
                    )}
                    {profile?.fitness_goal && (
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-gray-500" />
                        <span>{language === 'ar' ? 'الهدف' : 'Goal'}: {profile.fitness_goal}</span>
                      </div>
                    )}
                    {profile?.weight && (
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-gray-500" />
                        <span>{language === 'ar' ? 'الوزن' : 'Weight'}: {profile.weight} kg</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{language === 'ar' ? 'معلومات الاتصال' : 'Contact Information'}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  {profile?.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{profile.email}</span>
                    </div>
                  )}
                  {profile?.phone_number && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{profile.phone_number}</span>
                    </div>
                  )}
                  {profile?.address && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{profile.address}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-2">
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'ar' ? 'النشاط الأخير' : 'Recent Activity'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{language === 'ar' ? 'تاريخ الانضمام' : 'Joined'}: {format(new Date(trainee.assigned_at), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{language === 'ar' ? 'آخر تحديث' : 'Last Updated'}: {formatDistanceToNow(new Date(profile?.updated_at || trainee.assigned_at), { addSuffix: true })}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-gray-500" />
                    <span>{language === 'ar' ? 'تسجيل الدخول الأخير' : 'Last Login'}: {formatDistanceToNow(new Date(profile?.last_login || trainee.assigned_at), { addSuffix: true })}</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="space-y-2">
              <Card>
                <CardHeader className="flex justify-between items-center">
                  <CardTitle>{language === 'ar' ? 'ملاحظات' : 'Notes'}</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowNotesDialog(true)}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    {language === 'ar' ? 'تحديث' : 'Update'}
                  </Button>
                </CardHeader>
                <CardContent>
                  {trainee.notes ? (
                    <p className="text-sm text-gray-700">{trainee.notes}</p>
                  ) : (
                    <p className="text-sm text-gray-500">{language === 'ar' ? 'لا توجد ملاحظات' : 'No notes available'}</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {language === 'ar' ? 'إغلاق' : 'Close'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <UpdateNotesDialog 
        trainee={trainee}
        open={showNotesDialog}
        onOpenChange={setShowNotesDialog}
      />
    </>
  );
};
