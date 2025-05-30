
import { useLanguage } from "@/contexts/LanguageContext";

interface ProfileHeaderProps {
  isEditMode: boolean;
}

const ProfileHeader = ({ isEditMode }: ProfileHeaderProps) => {
  const { t } = useLanguage();

  return (
    <div className="mb-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
        {isEditMode ? t('profile.editProfile') : t('profile.title')}
      </h1>
      <p className="text-sm lg:text-base text-gray-600">
        {isEditMode 
          ? t('profile.updatePersonalInfo')
          : t('profile.viewPersonalInfo')}
      </p>
    </div>
  );
};

export default ProfileHeader;
