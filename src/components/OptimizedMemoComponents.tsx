
import { memo, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Optimized card component with memoization
export const OptimizedCard = memo<{
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  badges?: string[];
}>(({ title, subtitle, children, className = '', badges = [] }) => {
  const memoizedBadges = useMemo(() => 
    badges.map((badge, index) => (
      <Badge key={`${badge}-${index}`} variant="secondary" className="text-xs">
        {badge}
      </Badge>
    )),
    [badges]
  );

  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
        {badges.length > 0 && (
          <div className="flex gap-2">
            {memoizedBadges}
          </div>
        )}
      </div>
      {children}
    </Card>
  );
});

OptimizedCard.displayName = 'OptimizedCard';

// Optimized list item component
export const OptimizedListItem = memo<{
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  onClick?: () => void;
}>(({ id, title, description, icon, actions, onClick }) => {
  const handleClick = useMemo(() => onClick, [onClick]);

  return (
    <div 
      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div className="flex-shrink-0">
            {icon}
          </div>
        )}
        <div>
          <h4 className="font-medium text-gray-900">{title}</h4>
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
});

OptimizedListItem.displayName = 'OptimizedListItem';
