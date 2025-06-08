
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Apple, Cookie, Banana, Grape } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { toast } from 'sonner';

interface AddSnackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSnack: (snack: any) => void;
  selectedDay: number;
}

const AddSnackDialog = ({ isOpen, onClose, onAddSnack, selectedDay }: AddSnackDialogProps) => {
  const { t, isRTL } = useI18n();
  const [snackName, setSnackName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [selectedQuickSnack, setSelectedQuickSnack] = useState('');

  const quickSnacks = [
    { id: 'apple', name: t('Apple'), calories: 95, protein: 0.5, carbs: 25, fats: 0.3, icon: Apple },
    { id: 'almonds', name: t('Almonds (1oz)'), calories: 164, protein: 6, carbs: 6, fats: 14, icon: Cookie },
    { id: 'banana', name: t('Banana'), calories: 105, protein: 1.3, carbs: 27, fats: 0.4, icon: Banana },
    { id: 'greek_yogurt', name: t('Greek Yogurt'), calories: 130, protein: 20, carbs: 9, fats: 0, icon: Grape },
  ];

  const handleQuickSnackSelect = (snackId: string) => {
    const snack = quickSnacks.find(s => s.id === snackId);
    if (snack) {
      setSnackName(snack.name);
      setCalories(snack.calories.toString());
      setProtein(snack.protein.toString());
      setCarbs(snack.carbs.toString());
      setFats(snack.fats.toString());
      setSelectedQuickSnack(snackId);
    }
  };

  const handleCustomSnack = () => {
    setSnackName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFats('');
    setSelectedQuickSnack('');
  };

  const handleSubmit = () => {
    if (!snackName || !calories) {
      toast.error(t('Please fill in snack name and calories'));
      return;
    }

    const snack = {
      name: `🍎 ${snackName}`,
      meal_type: 'snack',
      calories: parseInt(calories),
      protein: parseFloat(protein) || 0,
      carbs: parseFloat(carbs) || 0,
      fats: parseFloat(fats) || 0,
      prep_time: 2,
      cook_time: 0,
      day_number: selectedDay,
      instructions: [t('Enjoy your healthy snack!')],
      ingredients: [{ name: snackName, quantity: '1', unit: 'serving' }]
    };

    onAddSnack(snack);
    onClose();
    toast.success(t('Snack added successfully!'));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className={`text-xl font-bold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Apple className="w-5 h-5 text-green-600" />
            {t('Add Healthy Snack')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Snacks */}
          <div>
            <Label className="text-base font-semibold mb-3 block">{t('Quick Snacks')}</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {quickSnacks.map((snack) => {
                const Icon = snack.icon;
                return (
                  <Card 
                    key={snack.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedQuickSnack === snack.id 
                        ? 'ring-2 ring-green-500 bg-green-50' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleQuickSnackSelect(snack.id)}
                  >
                    <CardContent className="p-4">
                      <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Icon className="w-5 h-5 text-green-600" />
                        <span className="font-medium">{snack.name}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-xs">
                        <div className="text-center">
                          <div className="font-semibold text-red-600">{snack.calories}</div>
                          <div className="text-gray-500">{t('cal')}</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-blue-600">{snack.protein}g</div>
                          <div className="text-gray-500">{t('protein')}</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-green-600">{snack.carbs}g</div>
                          <div className="text-gray-500">{t('carbs')}</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-yellow-600">{snack.fats}g</div>
                          <div className="text-gray-500">{t('fats')}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Custom Snack */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-base font-semibold">{t('Custom Snack')}</Label>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCustomSnack}
                className="text-xs"
              >
                {t('Create Custom')}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="snackName">{t('Snack Name')}</Label>
                <Input
                  id="snackName"
                  value={snackName}
                  onChange={(e) => setSnackName(e.target.value)}
                  placeholder={t('Enter snack name')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="calories">{t('Calories')}</Label>
                <Input
                  id="calories"
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="protein">{t('Protein (g)')}</Label>
                <Input
                  id="protein"
                  type="number"
                  step="0.1"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="carbs">{t('Carbs (g)')}</Label>
                <Input
                  id="carbs"
                  type="number"
                  step="0.1"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fats">{t('Fats (g)')}</Label>
                <Input
                  id="fats"
                  type="number"
                  step="0.1"
                  value={fats}
                  onChange={(e) => setFats(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          {snackName && calories && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Apple className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-800">{t('Snack Preview')}</span>
                </div>
                <div className="text-sm space-y-1">
                  <div className="font-semibold">🍎 {snackName}</div>
                  <div className="flex gap-4 text-xs">
                    <Badge variant="outline" className="bg-white">
                      {calories} {t('cal')}
                    </Badge>
                    {protein && (
                      <Badge variant="outline" className="bg-white">
                        {protein}g {t('protein')}
                      </Badge>
                    )}
                    {carbs && (
                      <Badge variant="outline" className="bg-white">
                        {carbs}g {t('carbs')}
                      </Badge>
                    )}
                    {fats && (
                      <Badge variant="outline" className="bg-white">
                        {fats}g {t('fats')}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button variant="outline" onClick={onClose}>
              {t('Cancel')}
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!snackName || !calories}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('Add Snack')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddSnackDialog;
