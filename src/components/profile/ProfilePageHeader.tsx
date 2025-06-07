
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Target, AlertCircle, Sparkles, Shield, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/hooks/useI18n";
import { toast } from "sonner";

interface ProfilePageHeaderProps {
  hasUnsavedChanges: boolean;
  completionPercentage: number;
  formData: any;
  user: any;
}

const ProfilePageHeader = ({ 
  hasUnsavedChanges, 
  completionPercentage, 
  formData, 
  user 
}: ProfilePageHeaderProps) => {
  const navigate = useNavigate();
  const { isAdmin, signOut } = useAuth();
  const { tFrom, isRTL } = useI18n();
  const tProfile = tFrom('profile');

  const handleSignOut = async () => {
    if (hasUnsavedChanges) {
      if (!confirm(String(tProfile('unsavedChangesSignOut')))) {
        return;
      }
    }
    
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error(String(tProfile('signOutFailed')));
    }
  };

  const getCompletionIcon = () => {
    if (completionPercentage >= 100) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (completionPercentage >= 50) return <Sparkles className="w-5 h-5 text-yellow-500" />;
    return <AlertCircle className="w-5 h-5 text-red-500" />;
  };

  return (
    <div className={`mb-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h1 className={`text-xl lg:text-2xl font-bold text-gray-800 ${isRTL ? 'font-arabic' : ''}`}>
            {String(tProfile('title'))}
          </h1>
          {getCompletionIcon()}
        </div>
        
        <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin')}
              className={`bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100 text-xs h-8 ${isRTL ? 'font-arabic' : ''}`}
            >
              <Shield className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
              {String(tProfile('admin'))}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className={`text-red-600 hover:bg-red-50 border-red-200 text-xs h-8 ${isRTL ? 'font-arabic' : ''}`}
          >
            <LogOut className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
            {String(tProfile('signOut'))}
          </Button>
        </div>
      </div>
      
      {hasUnsavedChanges && (
        <Alert className="mb-3 border-amber-200 bg-amber-50 p-3">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className={`text-amber-800 text-sm ${isRTL ? 'font-arabic text-right' : ''}`}>
            {String(tProfile('unsavedChanges'))}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ProfilePageHeader;
