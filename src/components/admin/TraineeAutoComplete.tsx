
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface UserOption {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  displayName: string;
}

interface TraineeAutoCompleteProps {
  value: string;
  onValueChange: (value: string) => void;
  onUserSelect: (userId: string) => void;
  placeholder?: string;
  className?: string;
  // Add unique identifier to prevent shared state
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
  const [dropdownPosition, setDropdownPosition] = useState<{top: number, left: number, width: number} | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, role')
        .not('role', 'in', '("admin","coach")')
        .order('first_name', { ascending: true });

      if (error) throw error;

      const userOptions = (data || []).map(user => ({
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        displayName: user.first_name && user.last_name 
          ? `${user.first_name} ${user.last_name} (${user.email})`
          : user.email
      }));

      setUsers(userOptions);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateDropdownPosition = () => {
    if (inputRef.current && showDropdown) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (value.trim() === '') {
      setFilteredUsers([]);
      setShowDropdown(false);
      return;
    }

    const searchTerm = value.toLowerCase();
    const filtered = users.filter(user => 
      user.email.toLowerCase().includes(searchTerm) ||
      user.first_name?.toLowerCase().includes(searchTerm) ||
      user.last_name?.toLowerCase().includes(searchTerm) ||
      user.displayName.toLowerCase().includes(searchTerm)
    );

    setFilteredUsers(filtered);
    setShowDropdown(filtered.length > 0);
    setSelectedIndex(-1);
    
    // Update position when showing dropdown
    if (filtered.length > 0) {
      setTimeout(updateDropdownPosition, 0);
    }
  }, [value, users, showDropdown]);

  // Update position on scroll or resize
  useEffect(() => {
    if (showDropdown) {
      const handleScroll = () => updateDropdownPosition();
      const handleResize = () => updateDropdownPosition();
      
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [showDropdown]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(e.target.value);
  };

  const handleUserSelect = (user: UserOption) => {
    onValueChange(user.displayName);
    onUserSelect(user.id);
    setShowDropdown(false);
    setSelectedIndex(-1);
    setDropdownPosition(null);
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
        setDropdownPosition(null);
        break;
    }
  };

  const handleInputFocus = () => {
    if (filteredUsers.length > 0) {
      setShowDropdown(true);
      setTimeout(updateDropdownPosition, 0);
    }
  };

  const handleInputBlur = (e: React.FocusEvent) => {
    // Delay hiding dropdown to allow for clicks
    setTimeout(() => {
      if (!dropdownRef.current?.contains(e.relatedTarget as Node)) {
        setShowDropdown(false);
        setSelectedIndex(-1);
        setDropdownPosition(null);
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
      
      {showDropdown && filteredUsers.length > 0 && dropdownPosition && (
        <div 
          ref={dropdownRef}
          className="fixed bg-white border border-gray-200 rounded-md shadow-xl max-h-60 overflow-hidden"
          style={{ 
            zIndex: 9999,
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: Math.max(dropdownPosition.width, 280),
            minWidth: '280px'
          }}
        >
          <ScrollArea className="h-full max-h-60">
            {filteredUsers.map((user, index) => (
              <div
                key={user.id}
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
          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};
