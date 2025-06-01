
import React from 'react';
import { Card } from "@/components/ui/card";
import { useI18n } from "@/hooks/useI18n";

const CoachChat = () => {
  const { t } = useI18n();

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">{t('coach.chat')}</h3>
      <p className="text-gray-600">{t('coach.chatPlaceholder')}</p>
    </Card>
  );
};

export default CoachChat;
