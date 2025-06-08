
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, User, Plus } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { toast } from 'sonner';

interface AssignTraineeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (traineeId: string) => void;
}

export const AssignTraineeDialog = ({ open, onOpenChange, onAssign }: AssignTraineeDialogProps) => {
  const { t, isRTL } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error(t('coach:enterSearchTerm') || 'Please enter a search term');
      return;
    }

    setIsSearching(true);
    try {
      // Mock search results
      setSearchResults([
        {
          id: '1',
          full_name: 'Ahmed Mohamed',
          email: 'ahmed@example.com',
          fitness_goal: 'weight_loss'
        },
        {
          id: '2',
          full_name: 'Sara Ali',
          email: 'sara@example.com',
          fitness_goal: 'muscle_gain'
        }
      ]);
    } catch (error) {
      toast.error(t('coach:searchFailed') || 'Search failed');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAssign = (traineeId: string) => {
    onAssign(traineeId);
    onOpenChange(false);
    setSearchTerm('');
    setSearchResults([]);
    toast.success(t('coach:traineeAssigned') || 'Trainee assigned successfully');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className={`text-xl font-bold ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('coach:assignTrainee') || 'Assign Trainee'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search">{t('coach:searchByName') || 'Search by name or email'}</Label>
            <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Input
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('coach:enterNameOrEmail') || 'Enter name or email...'}
                className={`flex-1 ${isRTL ? 'text-right' : ''}`}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={isSearching}>
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              <Label>{t('coach:searchResults') || 'Search Results'}</Label>
              {searchResults.map((user) => (
                <div key={user.id} className={`flex items-center justify-between p-3 border rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                      <p className="font-medium text-gray-900">{user.full_name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAssign(user.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {searchResults.length === 0 && searchTerm && !isSearching && (
            <div className="text-center py-8 text-gray-500">
              <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>{t('coach:noUsersFound') || 'No users found with that name or email'}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
