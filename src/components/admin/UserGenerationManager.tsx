
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface UserGenerationManagerProps {
  users: User[];
  onUpdateGenerations: (userId: string, newLimit: string) => void;
  isUpdating: boolean;
}

const UserGenerationManager = ({ users, onUpdateGenerations, isUpdating }: UserGenerationManagerProps) => {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [newGenerationLimit, setNewGenerationLimit] = useState('');

  const handleSubmit = () => {
    if (selectedUserId && newGenerationLimit) {
      onUpdateGenerations(selectedUserId, newGenerationLimit);
      setSelectedUserId('');
      setNewGenerationLimit('');
    }
  };

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-8">
      <h2 className="text-xl font-semibold mb-4">Update AI Generation Limits</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="user-select">Select User</Label>
          <select
            id="user-select"
            className="w-full p-2 border border-gray-300 rounded-md"
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
          <Label htmlFor="generation-limit">New Generation Limit</Label>
          <Input
            id="generation-limit"
            type="number"
            value={newGenerationLimit}
            onChange={(e) => setNewGenerationLimit(e.target.value)}
            placeholder="Enter new limit"
          />
        </div>
        <div className="flex items-end">
          <Button
            onClick={handleSubmit}
            disabled={isUpdating || !selectedUserId || !newGenerationLimit}
            className="w-full"
          >
            {isUpdating ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Update Limit
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default UserGenerationManager;
