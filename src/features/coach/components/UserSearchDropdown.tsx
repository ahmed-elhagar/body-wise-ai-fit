
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, User } from 'lucide-react';

interface UserSearchDropdownProps {
  onSelect: (userId: string) => void;
  placeholder?: string;
}

const UserSearchDropdown: React.FC<UserSearchDropdownProps> = ({
  onSelect,
  placeholder = "Search users..."
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    // Mock search - replace with actual search logic
    setTimeout(() => {
      setIsSearching(false);
    }, 1000);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button 
          onClick={handleSearch} 
          disabled={!searchTerm.trim() || isSearching}
          size="icon"
        >
          <Search className="w-4 h-4" />
        </Button>
      </div>
      
      {isSearching && (
        <div className="text-sm text-gray-600">Searching...</div>
      )}
    </div>
  );
};

export default UserSearchDropdown;
