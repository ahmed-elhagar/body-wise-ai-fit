
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// NOTE: This is a placeholder component.
// The original component likely includes user search functionality.
interface UserSearchDropdownProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  excludeRoles?: string[];
}

export const UserSearchDropdown = ({ value, onValueChange, placeholder }: UserSearchDropdownProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {/* In a real implementation, these would be populated from a user search */}
        <SelectItem value="user-id-1">Placeholder User One</SelectItem>
        <SelectItem value="user-id-2">Placeholder User Two</SelectItem>
      </SelectContent>
    </Select>
  );
};
