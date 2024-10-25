export type TCategory = {
  id: string;
  name: string;  
  url: string;   
  parentID: string | null;
  iconUrl: string | null;
  iconSize: number[];
};

export type TGroupJSON = {
  group: TCategory;
  categories: TCategoryJSON[];
};

export type TCategoryJSON = {
  category: TCategory;
  subCategories: TCategory[];
};

// Helper function to transform Fake Store category
export const transformCategory = (category: string): TCategory => ({
  id: category.toLowerCase().replace(/\s+/g, '-'),
  name: category,
  url: `/category/${category.toLowerCase().replace(/\s+/g, '-')}`,
  parentID: null,
  iconUrl: null,
  iconSize: [18, 18]
});