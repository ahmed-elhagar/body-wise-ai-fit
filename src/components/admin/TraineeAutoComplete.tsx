
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface UserOption {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  displayName: string;
  role?: string;
}

interface TraineeAutoCompleteProps {
  value: string;
  onValueChange: (value: string) => void;
  onUserSelect: (userId: string) => void;
  placeholder?: string;
  className?: string;
  instanceId?: string;
}

export const TraineeAutoComplete = ({ 
  value, 
  onValueChange, 
  onUserSelect,
  placeholder = "Enter trainee email or name...",
  className,
  instanceId = "default"
}: TraineeAutoCompleteProps) => {
  const [users, setUsers] = useState<UserOption[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserOption[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      console.log('Fetching users for trainee autocomplete...');
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, role')
        .not('role', 'in', '("admin","coach")')
        .order('first_name', { ascending: true });

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }

      console.log('Fetched users:', data);

      const userOptions = (data || []).map(user => ({
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        displayName: user.first_name && user.last_name 
          ? `${user.first_name} ${user.last_name} (${user.email})`
          : user.email
      }));

      setUsers(userOptions);
      console.log('Processed user options:', userOptions);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    console.log('Value changed:', value);
    console.log('Available users:', users.length);
    
    if (value.trim() === '') {
      setFilteredUsers([]);
      setShowDropdown(false);
      return;
    }

    const searchTerm = value.toLowerCase();
    console.log('Searching for:', searchTerm);
    
    const filtered = users.filter(user => {
      const emailMatch = user.email.toLowerCase().includes(searchTerm);
      const firstNameMatch = user.first_name?.toLowerCase().includes(searchTerm);
      const lastNameMatch = user.last_name?.toLowerCase().includes(searchTerm);
      const displayNameMatch = user.displayName.toLowerCase().includes(searchTerm);
      
      return emailMatch || firstNameMatch || lastNameMatch || displayNameMatch;
    });

    console.log('Filtered users:', filtered);
    setFilteredUsers(filtered);
    setShowDropdown(filtered.length > 0);
    setSelectedIndex(-1);
  }, [value, users]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log('Input changed to:', newValue);
    onValueChange(newValue);
  };

  const handleUserSelect = (user: UserOption) => {
    console.log('User selected:', user);
    onValueChange(user.displayName);
    onUserSelect(user.id);
    setShowDropdown(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || filteredUsers.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredUsers.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredUsers.length) {
          handleUserSelect(filteredUsers[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleInputFocus = () => {
    console.log('Input focused, filtered users:', filteredUsers.length);
    if (filteredUsers.length > 0) {
      setShowDropdown(true);
    }
  };

  const handleInputBlur = (e: React.FocusEvent) => {
    // Delay hiding dropdown to allow for clicks
    setTimeout(() => {
      if (!dropdownRef.current?.contains(e.relatedTarget as Node)) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    }, 150);
  };

  return (
    <div className={cn("relative", className)}>
      <Input
        ref={inputRef}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder={placeholder}
        className="w-full"
        autoComplete="off"
      />
      
      {showDropdown && filteredUsers.length > 0 && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-hidden z-50"
        >
          <ScrollArea className="h-full max-h-60">
            {filteredUsers.map((user, index) => (
              <div
                key={`${instanceId}-${user.id}`}
                className={cn(
                  "flex items-center gap-2 p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0",
                  index === selectedIndex && "bg-gray-100"
                )}
                onClick={() => handleUserSelect(user)}
              >
                <User className="h-4 w-4 text-gray-500" />
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-medium truncate">
                    {user.first_name && user.last_name 
                      ? `${user.first_name} ${user.last_name}`
                      : user.email
                    }
                  </span>
                  <span className="text-sm text-gray-500 truncate">
                    {user.email}
                  </span>
                  {user.role && (
                    <span className="text-xs text-blue-600 font-medium">
                      {user.role}
                    </span>
                  )}
                </div>
                {index === selectedIndex && (
                  <Check className="h-4 w-4 text-blue-600" />
                )}
              </div>
            ))}
          </ScrollArea>
        </div>
      )}
      
      {loading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
        </div>
      )}
      
      {/* Debug info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-400 mt-1">
          Users: {users.length}, Filtered: {filteredUsers.length}, Show: {showDropdown.toString()}
        </div>
      )}
    </div>
  );
};
