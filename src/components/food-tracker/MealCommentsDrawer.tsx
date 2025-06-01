import React, { useState, useEffect } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Save, X } from 'lucide-react';
import { useI18n } from "@/hooks/useI18n";

interface MealCommentsDrawerProps {
  mealId: string;
  initialComments: string;
  onSaveComments: (mealId: string, comments: string) => void;
  isLoading?: boolean;
}

const MealCommentsDrawer = ({
  mealId,
  initialComments,
  onSaveComments,
  isLoading = false
}: MealCommentsDrawerProps) => {
  const { t } = useI18n();
  const [comments, setComments] = useState(initialComments || '');
  const [isOpen, setIsOpen] = useState(false);

  // Reset comments when drawer opens or initialComments changes
  useEffect(() => {
    if (isOpen) {
      setComments(initialComments || '');
    }
  }, [isOpen, initialComments]);

  const handleSave = () => {
    onSaveComments(mealId, comments);
    setIsOpen(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <MessageSquare className="h-4 w-4 mr-1" />
          {initialComments ? t('Edit Notes') : t('Add Notes')}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>{t('Meal Notes')}</DrawerTitle>
            <DrawerDescription>
              {t('Add any notes about this meal, such as how you felt after eating it.')}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <Textarea
              placeholder={t('Enter your notes here...')}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="min-h-[150px]"
            />
          </div>
          <DrawerFooter className="flex flex-row justify-end space-x-2">
            <DrawerClose asChild>
              <Button variant="outline">
                <X className="h-4 w-4 mr-1" />
                {t('Cancel')}
              </Button>
            </DrawerClose>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center">
                  <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {t('Saving...')}
                </span>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-1" />
                  {t('Save Notes')}
                </>
              )}
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MealCommentsDrawer;
