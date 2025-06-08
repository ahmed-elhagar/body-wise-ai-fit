
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/hooks/useI18n";

interface IngredientsPreviewProps {
  ingredients: any[];
}

const IngredientsPreview = ({ ingredients }: IngredientsPreviewProps) => {
  const { t, isRTL } = useI18n();

  if (!ingredients || ingredients.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-1 mb-3 sm:mb-4 ${isRTL ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
      {ingredients.slice(0, 2).map((ingredient, idx) => (
        <Badge key={idx} variant="outline" className="text-xs bg-gray-50 hover:bg-gray-100 transition-colors">
          {typeof ingredient === 'string' ? ingredient : ingredient.name}
        </Badge>
      ))}
      {ingredients.length > 2 && (
        <Badge variant="outline" className="text-xs bg-fitness-primary/10 text-fitness-primary">
          +{ingredients.length - 2} {t('common:more') || 'more'}
        </Badge>
      )}
    </div>
  );
};

export default IngredientsPreview;
