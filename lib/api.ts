import { config } from './config';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface CartItem extends Product {
  quantity: number;
}

class ApiClient {
  private static instance: ApiClient;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = config.api.baseUrl;
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private async fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('API Request Failed:', error);
      throw error;
    }
  }

  // Products endpoints
  async getAllProducts(): Promise<Product[]> {
    return this.fetchApi<Product[]>('/products');
  }

  async getProduct(id: number): Promise<Product> {
    return this.fetchApi<Product>(`/products/${id}`);
  }

  async getCategories(): Promise<string[]> {
    return this.fetchApi<string[]>('/products/categories');
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return this.fetchApi<Product[]>(`/products/category/${category}`);
  }

  async getProductsPaginated(page: number = 1, limit: number = 10): Promise<{
    products: Product[];
    total: number;
    currentPage: number;
    totalPages: number;
  }> {
    const allProducts = await this.getAllProducts();
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      products: allProducts.slice(startIndex, endIndex),
      total: allProducts.length,
      currentPage: page,
      totalPages: Math.ceil(allProducts.length / limit)
    };
  }

  async searchProducts(query: string): Promise<Product[]> {
    const products = await this.getAllProducts();
    const searchTerm = query.toLowerCase();
    
    return products.filter(product => 
      product.title.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
  }

  async getSortedProducts(sortBy: 'price' | 'rating', order: 'asc' | 'desc' = 'asc'): Promise<Product[]> {
    const products = await this.getAllProducts();
    
    return [...products].sort((a, b) => {
      const valueA = sortBy === 'price' ? a.price : a.rating.rate;
      const valueB = sortBy === 'price' ? b.price : b.rating.rate;
      
      return order === 'asc' ? valueA - valueB : valueB - valueA;
    });
  }

  // Error handling helper
  private handleError(error: unknown): never {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred');
  }
}

// Export a singleton instance
export const api = ApiClient.getInstance();

// Export type for use in components
export type ApiInstance = typeof api;