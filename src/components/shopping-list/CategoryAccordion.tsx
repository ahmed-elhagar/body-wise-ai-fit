import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { useI18n } from "@/hooks/useI18n";

interface CategoryAccordionProps {
  category: string;
  items: any[];
}

const CategoryAccordion = ({ category, items }: CategoryAccordionProps) => {
  const { t } = useI18n();
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const handleCheck = (item: any) => {
    const itemId = item.name;
    if (checkedItems.includes(itemId)) {
      setCheckedItems(checkedItems.filter(id => id !== itemId));
    } else {
      setCheckedItems([...checkedItems, itemId]);
    }
  };

  const isChecked = (item: any) => checkedItems.includes(item.name);

  return (
    <AccordionItem value={category}>
      <AccordionTrigger className="font-semibold text-sm">
        {category} ({items.length})
      </AccordionTrigger>
      <AccordionContent className="pl-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-2 py-1">
            <Checkbox
              id={`item-${index}`}
              checked={isChecked(item)}
              onCheckedChange={() => handleCheck(item)}
            />
            <label
              htmlFor={`item-${index}`}
              className="text-sm leading-none peer-disabled:cursor-not-allowed"
            >
              {item.name} ({item.quantity} {item.unit})
            </label>
          </div>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
};

export default CategoryAccordion;
