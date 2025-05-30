
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Users, Settings } from 'lucide-react';
import { toast } from 'sonner';

const UserGenerationManager = () => {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [newGenerationLimit, setNewGenerationLimit] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Mock users data - in a real app, this would come from props or a hook
  const users = [
    { id: '1', first_name: 'John', last_name: 'Doe', email: 'john@example.com' },
    { id: '2', first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com' },
    { id: '3', first_name: 'Mike', last_name: 'Johnson', email: 'mike@example.com' },
  ];

  const handleSubmit = async () => {
    if (selectedUserId && newGenerationLimit) {
      setIsUpdating(true);
      try {
        // Add actual update logic here
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        toast.success('Generation limit updated successfully');
        setSelectedUserId('');
        setNewGenerationLimit('');
      } catch (error) {
        toast.error('Failed to update generation limit');
      } finally {
        setIsUpdating(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 md:p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">Update AI Generation Limits</h2>
            <p className="text-sm text-gray-600">Manage user generation quotas and limits</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="user-select" className="text-sm font-medium text-gray-700">Select User</Label>
            <select
              id="user-select"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <option value="">Choose a user...</option>
              {users?.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="generation-limit" className="text-sm font-medium text-gray-700">New Generation Limit</Label>
            <Input
              id="generation-limit"
              type="number"
              value={newGenerationLimit}
              onChange={(e) => setNewGenerationLimit(e.target.value)}
              placeholder="Enter new limit"
              className="mt-1 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-end">
            <Button
              onClick={handleSubmit}
              disabled={isUpdating || !selectedUserId || !newGenerationLimit}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isUpdating ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Users className="w-4 h-4 mr-2" />
              )}
              Update Limit
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserGenerationManager;
