
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';

interface CategoryAccordionProps {
  category: string;
  items: Array<{
    name: string;
    quantity: string;
    checked: boolean;
  }>;
}

const CategoryAccordion = ({ category, items }: CategoryAccordionProps) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value={category}>
        <AccordionTrigger className="text-left">
          {category} ({items.length} items)
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox id={`${category}-${index}`} defaultChecked={item.checked} />
                <label htmlFor={`${category}-${index}`} className="text-sm">
                  {item.name} ({item.quantity})
                </label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default CategoryAccordion;
