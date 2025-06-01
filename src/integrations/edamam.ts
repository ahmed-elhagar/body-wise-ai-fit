
export const searchFood = async (query: string) => {
  // Mock implementation for now
  return [
    {
      food: {
        foodId: '1',
        label: `Mock food for ${query}`,
        nutrients: {
          ENERC_KCAL: 100,
          PROCNT: 5,
          FAT: 2,
          CHOCDF: 20
        }
      }
    }
  ];
};
