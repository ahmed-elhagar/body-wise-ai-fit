
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/hooks/useI18n";
import { QuickActionItem } from "./quick-actions/QuickActionItem";
import { getQuickActionsData } from "./quick-actions/quickActionsData";

const QuickActions = () => {
  const navigate = useNavigate();
  const { t, isRTL } = useI18n();

  const actions = getQuickActionsData(t, navigate);

  return (
    <Card className="p-6 bg-white border border-health-border shadow-sm rounded-2xl">
      <h3 className={`text-xl font-semibold text-health-text-primary mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        {t('quickActions.title')}
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <QuickActionItem
            key={index}
            icon={action.icon}
            title={action.title}
            description={action.description}
            color={action.color}
            action={action.action}
            isRTL={isRTL}
          />
        ))}
      </div>
    </Card>
  );
};

export default QuickActions;
