
export interface ShoppingItem {
  name: string;
  quantity: number;
  unit: string;
  category: string;
}

export interface ShoppingListData {
  items: ShoppingItem[];
  groupedItems: Record<string, ShoppingItem[]>;
}
