import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface UserOption {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  displayName: string;
}

interface UserSearchDropdownProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  excludeRoles?: string[];
}

export const UserSearchDropdown = ({ 
  value, 
  onValueChange, 
  placeholder = "Search users...",
  excludeRoles = ['admin', 'coach']
}: UserSearchDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, role')
        .not('role', 'in', `(${excludeRoles.map(r => `"${r}"`).join(',')})`)
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

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  const selectedUser = users.find(user => user.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedUser ? (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="truncate">{selectedUser.displayName}</span>
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search by name or email..." />
          <CommandEmpty>
            {loading ? "Loading users..." : "No users found."}
          </CommandEmpty>
          <CommandGroup>
            <CommandList>
              <ScrollArea className="h-60">
                {users.map((user) => (
                  <CommandItem
                    key={user.id}
                    value={user.displayName}
                    onSelect={() => {
                      onValueChange(user.id);
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <User className="h-4 w-4" />
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
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          value === user.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </div>
                  </CommandItem>
                ))}
              </ScrollArea>
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
