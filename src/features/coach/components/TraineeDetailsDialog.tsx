
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Target, Calendar } from 'lucide-react';

interface TraineeProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  fitness_goal?: string;
  age?: number;
  weight?: number;
  height?: number;
}

interface TraineeDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trainee?: {
    id: string;
    assigned_at: string;
    notes?: string;
    trainee_profile: TraineeProfile;
  };
}

const TraineeDetailsDialog: React.FC<TraineeDetailsDialogProps> = ({
  open,
  onOpenChange,
  trainee
}) => {
  if (!trainee) return null;

  const { trainee_profile: profile } = trainee;
  const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {fullName || 'Trainee Details'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{profile.email || 'No email provided'}</span>
            </div>
            
            {profile.fitness_goal && (
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-gray-500" />
                <Badge variant="secondary">{profile.fitness_goal}</Badge>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm">
                Assigned: {new Date(trainee.assigned_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {(profile.age || profile.weight || profile.height) && (
            <div className="pt-3 border-t">
              <h4 className="font-medium text-sm mb-2">Physical Stats</h4>
              <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
                {profile.age && <div>Age: {profile.age}</div>}
                {profile.weight && <div>Weight: {profile.weight}kg</div>}
                {profile.height && <div>Height: {profile.height}cm</div>}
              </div>
            </div>
          )}

          {trainee.notes && (
            <div className="pt-3 border-t">
              <h4 className="font-medium text-sm mb-2">Notes</h4>
              <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                {trainee.notes}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TraineeDetailsDialog;
