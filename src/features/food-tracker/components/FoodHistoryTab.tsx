
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Search, Trash2, Clock, Utensils } from "lucide-react";
import { useFoodTracking } from '../hooks';
import { useLanguage } from "@/contexts/LanguageContext";
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

interface FoodHistoryTabProps {
  onClose: () => void;
}

const FoodHistoryTab = ({ onClose }: FoodHistoryTabProps) => {
  const { t } = useLanguage();
  const { foodConsumption, isLoading } = useFoodTracking();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [mealTypeFilter, setMealTypeFilter] = useState('all');

  const getFilteredHistory = () => {
    if (!foodConsumption) return [];

    let filtered = [...foodConsumption];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.food_item?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply meal type filter
    if (mealTypeFilter !== 'all') {
      filtered = filtered.filter(item => item.meal_type === mealTypeFilter);
    }

    // Apply date filter
    const now = new Date();
    switch (dateFilter) {
      case 'today':
        const today = format(now, 'yyyy-MM-dd');
        filtered = filtered.filter(item => item.consumed_at.startsWith(today));
        break;
      case 'yesterday':
        const yesterday = format(subDays(now, 1), 'yyyy-MM-dd');
        filtered = filtered.filter(item => item.consumed_at.startsWith(yesterday));
        break;
      case 'week':
        const weekAgo = subDays(now, 7);
        filtered = filtered.filter(item => new Date(item.consumed_at) >= weekAgo);
        break;
      case 'month':
        const monthAgo = subDays(now, 30);
        filtered = filtered.filter(item => new Date(item.consumed_at) >= monthAgo);
        break;
    }

    return filtered;
  };

  const getMealTypeIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      case 'snack': return '🍎';
      default: return '🍽️';
    }
  };

  const getMealTypeColor = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'bg-orange-100 text-orange-800';
      case 'lunch': return 'bg-yellow-100 text-yellow-800';
      case 'dinner': return 'bg-blue-100 text-blue-800';
      case 'snack': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredHistory = getFilteredHistory();

  if (isLoading) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
          <p className="text-gray-600 mt-4">{t('Loading food history...')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {t('Food History')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder={t('Search foods...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('Select time period')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('All time')}</SelectItem>
                <SelectItem value="today">{t('Today')}</SelectItem>
                <SelectItem value="yesterday">{t('Yesterday')}</SelectItem>
                <SelectItem value="week">{t('Last 7 days')}</SelectItem>
                <SelectItem value="month">{t('Last 30 days')}</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={mealTypeFilter} onValueChange={setMealTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('Meal type')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('All meals')}</SelectItem>
                <SelectItem value="breakfast">{t('Breakfast')}</SelectItem>
                <SelectItem value="lunch">{t('Lunch')}</SelectItem>
                <SelectItem value="dinner">{t('Dinner')}</SelectItem>
                <SelectItem value="snack">{t('Snacks')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results summary */}
          <div className="text-sm text-gray-600">
            {filteredHistory.length === 0 ? (
              <p>{t('No food entries found')}</p>
            ) : (
              <p>
                {t('Showing')} {filteredHistory.length} {t('entries')}
                {searchTerm && ` ${t('matching')} "${searchTerm}"`}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* History entries */}
      {filteredHistory.length === 0 ? (
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {searchTerm ? t('No matching entries') : t('No food history yet')}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? t('Try adjusting your search or filters')
                : t('Start logging your meals to see your nutrition history')
              }
            </p>
            {searchTerm && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setDateFilter('all');
                  setMealTypeFilter('all');
                }}
              >
                {t('Clear filters')}
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredHistory.map((entry) => (
            <Card key={entry.id} className="bg-white/90 backdrop-blur-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{getMealTypeIcon(entry.meal_type)}</span>
                      <h4 className="font-semibold text-gray-800">
                        {entry.food_item?.name || 'Unknown Food'}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMealTypeColor(entry.meal_type)}`}>
                        {entry.meal_type}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-2">
                      <div className="text-center">
                        <p className="text-xs text-gray-500">{t('Calories')}</p>
                        <p className="font-bold text-red-600">{Math.round(entry.calories_consumed)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">{t('Protein')}</p>
                        <p className="font-bold text-blue-600">{Math.round(entry.protein_consumed)}g</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">{t('Carbs')}</p>
                        <p className="font-bold text-yellow-600">{Math.round(entry.carbs_consumed)}g</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">{t('Fat')}</p>
                        <p className="font-bold text-green-600">{Math.round(entry.fat_consumed)}g</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(entry.consumed_at), 'MMM dd, yyyy HH:mm')}
                      </span>
                      <span>{entry.quantity_g}g</span>
                      {entry.source && (
                        <span className="capitalize">{entry.source.replace('_', ' ')}</span>
                      )}
                    </div>
                    
                    {entry.notes && (
                      <p className="text-sm text-gray-600 mt-2 italic">
                        {entry.notes}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodHistoryTab;
