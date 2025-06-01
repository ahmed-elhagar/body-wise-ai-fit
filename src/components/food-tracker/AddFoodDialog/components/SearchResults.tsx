import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/useI18n";

interface SearchResultsProps {
  results: any[];
  onSelect: (item: any) => void;
}

export const SearchResults = ({ results, onSelect }: SearchResultsProps) => {
  const { t } = useI18n();

  if (!results || results.length === 0) {
    return (
      <Card className="p-4 text-center">
        <p className="text-gray-500">{t('foodTracker.noResults')}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {results.map((item) => (
        <Card key={item.food_name} className="p-3 hover:bg-gray-50 cursor-pointer" onClick={() => onSelect(item)}>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">{item.food_name}</h4>
              <p className="text-sm text-gray-500">
                {item.serving_qty} {item.serving_unit} - {item.calories} cal
              </p>
            </div>
            <Button variant="outline" size="sm">
              {t('foodTracker.add')}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

