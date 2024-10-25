"use server";

import { z } from "zod";
import { TBrand } from "@/types/product";
import { api } from "@/lib/api";

const ValidateUpdateBrand = z.object({
  id: z.string().min(1),
  name: z.string().min(3),
});

async function extractBrandsFromProducts(): Promise<TBrand[]> {
  try {
    const products = await api.getAllProducts();
    
    const uniqueBrands = new Set(products.map(product => product.category));
    
    return Array.from(uniqueBrands).map((category, index) => ({
      id: `brand-${index + 1}`,
      name: category.charAt(0).toUpperCase() + category.slice(1)
    }));
  } catch (error) {
    console.error('Error extracting brands:', error);
    return [];
  }
}

let mockBrands: TBrand[] = [];

async function initializeMockBrands() {
  if (mockBrands.length === 0) {
    mockBrands = await extractBrandsFromProducts();
  }
}

export const addBrand = async (brandName: string) => {
  if (!brandName || brandName === "") return { error: "Invalid Data!" };

  try {
    await initializeMockBrands();
    
    
    const newBrand: TBrand = {
      id: `brand-${mockBrands.length + 1}`,
      name: brandName
    };
    
    mockBrands.push(newBrand);
    return { res: newBrand };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};

export const getAllBrands = async () => {
  try {
    await initializeMockBrands();
    return { res: mockBrands };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};

export const deleteBrand = async (brandId: string) => {
  if (!brandId || brandId === "") return { error: "Invalid Data!" };
  
  try {
    await initializeMockBrands();
    const brandIndex = mockBrands.findIndex(brand => brand.id === brandId);
    
    if (brandIndex === -1) {
      return { error: "Brand not found!" };
    }

    const deletedBrand = mockBrands[brandIndex];
    mockBrands = mockBrands.filter(brand => brand.id !== brandId);
    
    return { res: deletedBrand };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};

export const updateBrand = async (data: TBrand) => {
  if (!ValidateUpdateBrand.safeParse(data).success) {
    return { error: "Invalid Data!" };
  }

  try {
    await initializeMockBrands();
    const brandIndex = mockBrands.findIndex(brand => brand.id === data.id);
    
    if (brandIndex === -1) {
      return { error: "Brand not found!" };
    }

    mockBrands[brandIndex] = {
      ...mockBrands[brandIndex],
      name: data.name
    };

    return { res: mockBrands[brandIndex] };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};


export const getBrandById = async (brandId: string) => {
  try {
    await initializeMockBrands();
    const brand = mockBrands.find(b => b.id === brandId);
    return brand ? { res: brand } : { error: "Brand not found!" };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};

export const searchBrands = async (query: string) => {
  try {
    await initializeMockBrands();
    const results = mockBrands.filter(brand => 
      brand.name.toLowerCase().includes(query.toLowerCase())
    );
    return { res: results };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};

export type BrandResponse = {
  res?: TBrand;
  error?: string;
};

export type BrandsResponse = {
  res?: TBrand[];
  error?: string;
};