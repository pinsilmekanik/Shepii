"use server";

import { z } from "zod";
import { api } from "@/lib/api";
import { TCategory, TGroupJSON } from "@/types/categories";

const GetAllCategories = z.object({
  id: z.string(),
  parentID: z.string().nullable(),
  name: z.string().min(3),
  url: z.string().min(3),
  iconSize: z.array(z.number().int()),
  iconUrl: z.string().nullable(),
});

const AddCategory = z.object({
  parentID: z.string().nullable(),
  name: z.string().min(3),
  url: z.string().min(3),
  iconSize: z.array(z.number().int()),
  iconUrl: z.string().nullable(),
});

const UpdateCategory = z.object({
  id: z.string(),
  name: z.string().min(3).optional(),
  url: z.string().min(3).optional(),
  iconSize: z.array(z.number().int()),
  iconUrl: z.string().optional(),
});

export type TGetAllCategories = z.infer<typeof GetAllCategories>;
export type TAddCategory = z.infer<typeof AddCategory>;
export type TUpdateCategory = z.infer<typeof UpdateCategory>;

let mockCategories: TCategory[] = [];

async function initializeCategories() {
  if (mockCategories.length === 0) {
    try {
      const categories = await api.getCategories();
      
      mockCategories = categories.map((cat, index) => ({
        id: `cat-${index + 1}`,
        name: cat.charAt(0).toUpperCase() + cat.slice(1),
        url: `/${cat.toLowerCase().replace(/\s+/g, '-')}`,
        parentID: null,
        iconUrl: null,
        iconSize: [18, 18]
      }));

      const subcategories: TCategory[] = mockCategories.flatMap((cat, index) => {
        return [`${cat.name} Popular`, `${cat.name} New`, `${cat.name} Sale`].map((subName, subIndex) => ({
          id: `subcat-${index}-${subIndex}`,
          name: subName,
          url: `${cat.url}/${subName.toLowerCase().replace(/\s+/g, '-')}`,
          parentID: cat.id,
          iconUrl: null,
          iconSize: [16, 16]
        }));
      });

      mockCategories = [...mockCategories, ...subcategories];
    } catch (error) {
      console.error('Error initializing categories:', error);
    }
  }
  return mockCategories;
}

const convertToJson = (categoriesTable: TCategory[]): TGroupJSON[] => {
  const generateCategoryGroups = (categoriesTable: TCategory[]): TGroupJSON[] => {
    return categoriesTable
      .filter((tableRow) => tableRow.parentID === null)
      .map((group) => ({ group, categories: [] }));
  };

  const getChildren = (array: TCategory[], parentID: string | null): TCategory[] => {
    return array.filter((item) => item.parentID === parentID);
  };

  const groups: TGroupJSON[] = generateCategoryGroups(categoriesTable);

  groups.forEach((group) => {
    group.categories = getChildren(categoriesTable, group.group.id).map(
      (category) => ({ category, subCategories: getChildren(categoriesTable, category.id) })
    );
  });

  return groups;
};

export const getAllCategories = async () => {
  try {
    const categories = await initializeCategories();
    return { res: categories };
  } catch (error) {
    return { error: "Can't read categories" };
  }
};

export const getAllCategoriesJSON = async () => {
  try {
    const categories = await initializeCategories();
    return { res: convertToJson(categories) };
  } catch (error) {
    return { error: "Can't read Category Groups" };
  }
};

export const addCategory = async (data: TAddCategory) => {
  if (!AddCategory.safeParse(data).success) return { error: "Invalid Data!" };

  try {
    await initializeCategories();
    
    const newCategory: TCategory = {
      id: `cat-${Date.now()}`,
      ...data
    };

    mockCategories.push(newCategory);
    return { res: newCategory };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};

export const updateCategory = async (data: TUpdateCategory) => {
  if (!UpdateCategory.safeParse(data).success)
    return { error: "Data is not valid" };

  const { id, iconSize, ...values } = data;

  try {
    await initializeCategories();
    
    const categoryIndex = mockCategories.findIndex(cat => cat.id === id);
    if (categoryIndex === -1) return { error: "Category not found" };

    mockCategories[categoryIndex] = {
      ...mockCategories[categoryIndex],
      ...values,
      iconSize
    };

    return { res: mockCategories[categoryIndex] };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};

export const deleteCategory = async (id: string) => {
  if (!id) return { error: "Invalid ID!" };

  try {
    await initializeCategories();
    
    const hasChildren = mockCategories.some(cat => cat.parentID === id);
    if (hasChildren) return { error: "Category has children!" };

    const categoryIndex = mockCategories.findIndex(cat => cat.id === id);
    if (categoryIndex === -1) return { error: "Category not found" };

    const deletedCategory = mockCategories[categoryIndex];
    mockCategories = mockCategories.filter(cat => cat.id !== id);

    return { res: deletedCategory };
  } catch (error) {
    return { error: "Can't delete category" };
  }
};

export const getCategoryBySlug = async (slug: string) => {
  try {
    const categories = await initializeCategories();
    const category = categories.find(cat => cat.url.includes(slug));
    return category ? { res: category } : { error: "Category not found" };
  } catch (error) {
    return { error: "Can't find category" };
  }
};

export const getCategoryPath = async (categoryId: string) => {
  try {
    const categories = await initializeCategories();
    const path: TCategory[] = [];
    let currentCategory = categories.find(cat => cat.id === categoryId);

    while (currentCategory) {
      path.unshift(currentCategory);
      currentCategory = currentCategory?.parentID 
        ? categories.find(cat => cat.id === currentCategory?.parentID)
        : undefined;
    }

    return { res: path };
  } catch (error) {
    return { error: "Can't get category path" };
  }
};