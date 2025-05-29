
import { useLanguage } from "@/contexts/LanguageContext";

interface ProfileHeaderProps {
  isEditMode: boolean;
}

const ProfileHeader = ({ isEditMode }: ProfileHeaderProps) => {
  const { t } = useLanguage();

  return (
    <div className="mb-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
        {isEditMode ? t('edit') + ' ' + t('profile') : t('profile')}
      </h1>
      <p className="text-sm lg:text-base text-gray-600">
        {isEditMode 
          ? 'Update your personal information and preferences' 
          : 'View your personal information and preferences'}
      </p>
    </div>
  );
};

export default ProfileHeader;
