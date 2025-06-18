
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ChatSearchBarProps {
  onSearch: (query: string) => void;
}

const ChatSearchBar = ({ onSearch }: ChatSearchBarProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        placeholder="Search conversations..."
        onChange={(e) => onSearch(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};

export default ChatSearchBar;
