
// Centralized shopping list types
export interface ShoppingItem {
  name: string;
  quantity: number;
  unit: string;
  category: string;
}

export interface GroupedShoppingItems {
  [category: string]: ShoppingItem[];
}

export interface ShoppingListData {
  items: ShoppingItem[];
  groupedItems: GroupedShoppingItems;
}
