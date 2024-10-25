"use server";

import { z } from "zod";
import { api } from "@/lib/api";
import {
  TAddProductFormValues,
  TCartListItemDB,
  TPath,
  TProductListItem,
  TProductPageInfo,
  TSpecification,
  TBaseProduct
} from "@/types/product";

// Validation schemas
const ValidateAddProduct = z.object({
  name: z.string().min(3),
  price: z.number().min(0),
  description: z.string().optional(),
  category: z.string(),
  image: z.string().url(),
  isAvailable: z.boolean().default(true),
  specialFeatures: z.array(z.string()),
  specifications: z.array(
    z.object({
      groupName: z.string(),
      specs: z.array(z.object({
        name: z.string(),
        value: z.string()
      }))
    })
  )
});

// Helper functions
const transformFakeStoreProduct = (product: any): TProductPageInfo => ({
  id: product.id.toString(),
  name: product.title,
  desc: product.description,
  images: [product.image],
  price: product.price,
  salePrice: null,
  isAvailable: true,
  specialFeatures: [],
  optionSets: [],
  specifications: [
    {
      groupName: "General",
      specs: [
        { name: "Category", value: product.category },
        { name: "Rating", value: `${product.rating.rate}/5 (${product.rating.count} reviews)` }
      ]
    }
  ],
  path: generateCategoryPath(product.category)
});

const generateCategoryPath = (category: string): TPath[] => {
  return [
    {
      id: 'root',
      parentID: null,
      name: 'Home',
      url: '/'
    },
    {
      id: category.toLowerCase().replace(/\s+/g, '-'),
      parentID: 'root',
      name: category,
      url: `/category/${category.toLowerCase().replace(/\s+/g, '-')}`
    }
  ];
};

// Product actions
export const getAllProducts = async () => {
  try {
    const products = await api.getAllProducts();
    
    const result: TProductListItem[] = products.map(product => ({
      id: product.id.toString(),
      name: product.title,
      category: {
        id: product.category.toLowerCase().replace(/\s+/g, '-'),
        name: product.category
      }
    }));

    return { res: result };
  } catch (error) {
    return { error: "Failed to fetch products" };
  }
};

export const getOneProduct = async (productID: string) => {
  if (!productID) return { error: "Invalid Product ID!" };

  try {
    const product = await api.getProduct(parseInt(productID));
    const transformedProduct = transformFakeStoreProduct(product);
    return { res: transformedProduct };
  } catch (error) {
    return { error: "Product not found" };
  }
};

export const getCartProducts = async (productIDs: string[]) => {
  if (!productIDs?.length) return { error: "Invalid Product List" };

  try {
    const products = await Promise.all(
      productIDs.map(id => api.getProduct(parseInt(id)))
    );

    const result: TCartListItemDB[] = products.map(product => ({
      id: product.id.toString(),
      name: product.title,
      images: [product.image],
      price: product.price,
      salePrice: null
    }));

    return { res: result };
  } catch (error) {
    return { error: "Failed to fetch cart products" };
  }
};


export const getProductsByCategory = async (category: string) => {
  try {
    const products = await api.getProductsByCategory(category);
    return {
      res: products.map(transformFakeStoreProduct)
    };
  } catch (error) {
    return { error: "Failed to fetch products by category" };
  }
};

export const searchProducts = async (query: string) => {
  try {
    const allProducts = await api.getAllProducts();
    const filteredProducts = allProducts.filter(product => 
      product.title.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );
    
    return {
      res: filteredProducts.map(transformFakeStoreProduct)
    };
  } catch (error) {
    return { error: "Failed to search products" };
  }
};

export type ProductResponse = {
  res?: TProductPageInfo;
  error?: string;
};

export type ProductsResponse = {
  res?: TProductPageInfo[];
  error?: string;
};

// Cache implementation for better performance
const productCache = new Map<string, TProductPageInfo>();

export const getCachedProduct = async (productID: string) => {
  if (productCache.has(productID)) {
    return { res: productCache.get(productID) };
  }

  const result = await getOneProduct(productID);
  if (result.res) {
    productCache.set(productID, result.res);
  }
  return result;
};