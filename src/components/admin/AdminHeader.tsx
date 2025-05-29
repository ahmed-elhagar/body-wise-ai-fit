
import { Crown, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminHeaderProps {
  onForceLogout: () => void;
  isLoggingOut: boolean;
}

const AdminHeader = ({ onForceLogout, isLoggingOut }: AdminHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center">
        <Crown className="w-8 h-8 text-yellow-500 mr-3" />
        <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
      </div>
      
      <Button
        onClick={onForceLogout}
        disabled={isLoggingOut}
        variant="destructive"
        className="flex items-center space-x-2"
      >
        {isLoggingOut ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <LogOut className="w-4 h-4" />
        )}
        <span>Force Logout All Users</span>
      </Button>
    </div>
  );
};

export default AdminHeader;
