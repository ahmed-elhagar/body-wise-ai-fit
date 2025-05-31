import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'react-router-dom';

export type Language = 'en' | 'ar';

interface LanguageContextProps {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextProps>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
  isRTL: false,
});

interface LanguageProviderProps {
  children: React.ReactNode;
}

const translations = {
  en: {
    'Dashboard': 'Dashboard',
    'Meal Plan': 'Meal Plan',
    'Food Tracker': 'Food Tracker',
    'Exercise': 'Exercise',
    'Goals': 'Goals',
    'Profile': 'Profile',
    'Settings': 'Settings',
    'Logout': 'Logout',
    'Toggle Theme': 'Toggle Theme',
    'Language': 'Language',
    'Select Language': 'Select Language',
    'Welcome': 'Welcome',
    'Welcome back': 'Welcome back',
    'Dashboard Page': 'Dashboard Page',
    'Meal Plan Page': 'Meal Plan Page',
    'Food Tracker Page': 'Food Tracker Page',
    'Exercise Page': 'Exercise Page',
    'Goals Page': 'Goals Page',
    'Profile Page': 'Profile Page',
    'Settings Page': 'Settings Page',
    'Logout Action': 'Logout Action',
    'Toggle Theme Action': 'Toggle Theme Action',
    'Language Setting': 'Language Setting',
    'Click me': 'Click me',
    'Open': 'Open',
    'Close': 'Close',
    'Save': 'Save',
    'Cancel': 'Cancel',
    'Edit': 'Edit',
    'Delete': 'Delete',
    'Add': 'Add',
    'View': 'View',
    'Submit': 'Submit',
    'Loading': 'Loading',
    'Success': 'Success',
    'Error': 'Error',
    'Info': 'Info',
    'Warning': 'Warning',
    'Confirmation': 'Confirmation',
    'Yes': 'Yes',
    'No': 'No',
    'Okay': 'Okay',
    'Next': 'Next',
    'Previous': 'Previous',
    'Today': 'Today',
    'Yesterday': 'Yesterday',
    'Tomorrow': 'Tomorrow',
    'Now': 'Now',
    'Later': 'Later',
    'January': 'January',
    'February': 'February',
    'March': 'March',
    'April': 'April',
    'May': 'May',
    'June': 'June',
    'July': 'July',
    'August': 'August',
    'September': 'September',
    'October': 'October',
    'November': 'November',
    'December': 'December',
    'Sunday': 'Sunday',
    'Monday': 'Monday',
    'Tuesday': 'Tuesday',
    'Wednesday': 'Wednesday',
    'Thursday': 'Thursday',
    'Friday': 'Friday',
    'Saturday': 'Saturday',
    'Sun': 'Sun',
    'Mon': 'Mon',
    'Tue': 'Tue',
    'Wed': 'Wed',
    'Thu': 'Thu',
    'Fri': 'Fri',
    'Sat': 'Sat',
    'Calories': 'Calories',
    'Protein': 'Protein',
    'Carbs': 'Carbs',
    'Fat': 'Fat',
    'Daily Nutrition': 'Daily Nutrition',
    "Today's Food Log": "Today's Food Log",
    "Add Food": "Add Food",
    "No food logged today": "No food logged today",
    "Start tracking your nutrition by adding your first meal!": "Start tracking your nutrition by adding your first meal!",
    "Are you sure you want to delete this food log entry?": "Are you sure you want to delete this food log entry?",
    'Meal Comments': 'Meal Comments',
    'No comments yet': 'No comments yet',
    'Start a conversation with your trainee': 'Start a conversation with your trainee',
    'Your coach can leave feedback here': 'Your coach can leave feedback here',
    'Leave feedback for your trainee...': 'Leave feedback for your trainee...',
    'Reply to your coach...': 'Reply to your coach...',
    'Press Ctrl+Enter to send': 'Press Ctrl+Enter to send',
    'Coach': 'Coach',
    'You': 'You',
    'Are you sure you want to delete this comment?': 'Are you sure you want to delete this comment?',
    'Comment added successfully': 'Comment added successfully',
    'Failed to add comment': 'Failed to add comment',
    'Comment deleted': 'Comment deleted',
    'Failed to delete comment': 'Failed to delete comment',
    'Coach left feedback 👋': 'Coach left feedback 👋',
    'Viewing meals as': 'Viewing meals as',
    'Meals': 'Meals',
    'Trainees': 'Trainees',
    'Admin Dashboard': 'Admin Dashboard',
    'Coach Panel': 'Coach Panel',
    'Admin': 'Admin',
  },
  ar: {
    'Dashboard': 'لوحة القيادة',
    'Meal Plan': 'خطة الوجبات',
    'Food Tracker': 'متتبع الطعام',
    'Exercise': 'تمرين',
    'Goals': 'الأهداف',
    'Profile': 'الملف الشخصي',
    'Settings': 'الإعدادات',
    'Logout': 'تسجيل الخروج',
    'Toggle Theme': 'تبديل المظهر',
    'Language': 'اللغة',
    'Select Language': 'اختر اللغة',
    'Welcome': 'مرحبا',
    'Welcome back': 'مرحبا بعودتك',
    'Dashboard Page': 'صفحة لوحة القيادة',
    'Meal Plan Page': 'صفحة خطة الوجبات',
    'Food Tracker Page': 'صفحة متتبع الطعام',
    'Exercise Page': 'صفحة التمرين',
    'Goals Page': 'صفحة الأهداف',
    'Profile Page': 'صفحة الملف الشخصي',
    'Settings Page': 'صفحة الإعدادات',
    'Logout Action': 'تسجيل الخروج',
    'Toggle Theme Action': 'تبديل المظهر',
    'Language Setting': 'إعدادات اللغة',
    'Click me': 'اضغط هنا',
    'Open': 'فتح',
    'Close': 'إغلاق',
    'Save': 'حفظ',
    'Cancel': 'إلغاء',
    'Edit': 'تعديل',
    'Delete': 'حذف',
    'Add': 'إضافة',
    'View': 'عرض',
    'Submit': 'إرسال',
    'Loading': 'جار التحميل',
    'Success': 'نجاح',
    'Error': 'خطأ',
    'Info': 'معلومات',
    'Warning': 'تحذير',
    'Confirmation': 'تأكيد',
    'Yes': 'نعم',
    'No': 'لا',
    'Okay': 'موافق',
    'Next': 'التالي',
    'Previous': 'السابق',
    'Today': 'اليوم',
    'Yesterday': 'الأمس',
    'Tomorrow': 'غدًا',
    'Now': 'الآن',
    'Later': 'لاحقًا',
    'January': 'يناير',
    'February': 'فبراير',
    'March': 'مارس',
    'April': 'أبريل',
    'May': 'مايو',
    'June': 'يونيو',
    'July': 'يوليو',
    'August': 'أغسطس',
    'September': 'سبتمبر',
    'October': 'أكتوبر',
    'November': 'نوفمبر',
    'December': 'ديسمبر',
    'Sunday': 'الأحد',
    'Monday': 'الاثنين',
    'Tuesday': 'الثلاثاء',
    'Wednesday': 'الأربعاء',
    'Thursday': 'الخميس',
    'Friday': 'الجمعة',
    'Saturday': 'السبت',
    'Sun': 'الأحد',
    'Mon': 'الاثنين',
    'Tue': 'الثلاثاء',
    'Wed': 'الأربعاء',
    'Thu': 'الخميس',
    'Fri': 'الجمعة',
    'Sat': 'السبت',
    'Calories': 'السعرات الحرارية',
    'Protein': 'بروتين',
    'Carbs': 'الكربوهيدرات',
    'Fat': 'الدهون',
    'Daily Nutrition': 'التغذية اليومية',
    "Today's Food Log": "سجل الطعام اليوم",
    "Add Food": "إضافة طعام",
    "No food logged today": "لا يوجد طعام مسجل اليوم",
    "Start tracking your nutrition by adding your first meal!": "ابدأ بتتبع تغذيتك بإضافة وجبتك الأولى!",
    "Are you sure you want to delete this food log entry?": "هل أنت متأكد من حذف هذا السجل الغذائي؟",
    'Meal Comments': 'تعليقات الوجبة',
    'No comments yet': 'لا توجد تعليقات بعد',
    'Start a conversation with your trainee': 'ابدأ محادثة مع المتدرب',
    'Your coach can leave feedback here': 'يمكن لمدربك ترك ملاحظات هنا',
    'Leave feedback for your trainee...': 'اترك ملاحظات للمتدرب...',
    'Reply to your coach...': 'رد على مدربك...',
    'Press Ctrl+Enter to send': 'اضغط Ctrl+Enter للإرسال',
    'Coach': 'مدرب',
    'You': 'أنت',
    'Are you sure you want to delete this comment?': 'هل أنت متأكد من حذف هذا التعليق؟',
    'Comment added successfully': 'تم إضافة التعليق بنجاح',
    'Failed to add comment': 'فشل في إضافة التعليق',
    'Comment deleted': 'تم حذف التعليق',
    'Failed to delete comment': 'فشل في حذف التعليق',
    'Coach left feedback 👋': 'ترك المدرب ملاحظة 👋',
    'Viewing meals as': 'عرض وجبات',
    'Meals': 'الوجبات',
    'Trainees': 'المتدربين',
    'Admin Dashboard': 'لوحة الإدارة',
    'Coach Panel': 'لوحة المدرب',
    'Admin': 'إدارة',
  }
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const router = useRouter();

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') || router.locale || 'en';
    setLanguage(storedLanguage as Language);
  }, [router.locale]);

  useEffect(() => {
    localStorage.setItem('language', language);
    router.push(router.pathname, router.asPath, { locale: language });
  }, [language, router]);

  const t = (key: string) => {
    const translation = (translations[language] && translations[language][key]) || key;
    return translation;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      <div dir={isRTL ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
