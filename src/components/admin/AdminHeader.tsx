
import { Crown, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

const AdminHeader = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleForceLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Add force logout logic here if needed
      toast.success('Force logout action initiated');
    } catch (error) {
      toast.error('Failed to force logout users');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-indigo-500/10 rounded-2xl" />
      
      <div className="relative p-4 md:p-6 bg-white/90 backdrop-blur-sm rounded-2xl border-0 shadow-lg overflow-hidden">
        <div className="absolute top-2 right-2 md:top-4 md:right-4 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-xl" />
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Crown className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Admin Panel
              </h1>
              <p className="text-sm md:text-base text-gray-600 font-medium">
                Manage users, subscriptions, and system settings
              </p>
            </div>
          </div>
          
          <Button
            onClick={handleForceLogout}
            disabled={isLoggingOut}
            variant="destructive"
            className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
          >
            {isLoggingOut ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
            <span className="hidden md:inline">Force Logout All</span>
            <span className="md:hidden">Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
