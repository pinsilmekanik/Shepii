export type TBaseProduct = {
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
};

export type TUserReview = {
  id: number;          
  userName: string;
  userImage: string;
  rating: number;      
  date: Date;
  likeNumber: number;
  dislikeNumber: number;
  text: string;
  advantages?: string[];
  disAdvantages?: string[];
};

export type TProductSpec = {
  groupName: string;
  specs: {
    label: string;
    data: string[];
  }[];
};

export type TSpecification = {
  groupName: string;
  specs: {
    name: string;
    value: string;
  }[];
};

export type TBrand = {
  id: string;
  name: string;
};

export type TProductBoard = {
  id: number;          
  name: string;        
  isAvailable: boolean;
  shortDesc: string;   
  price: number;
  dealDate?: Date;
  dealPrice?: number;
  rating: {           
    rate: number;
    count: number;
  };
  specialFeatures?: string[];
  defaultQuantity: number;
};

export type TProductPath = {
  label: string;
  url: string;
};

export type TPath = {
  id: string;
  parentID: string | null;
  name: string;
  url: string;
};

export type TProduct = {
  path: TProductPath[];
  board: TProductBoard;
  gallery: string[];   
  specification: TProductSpec[];
  reviews: TUserReview[];
};

export type TListItem = {
  id: number;
  name: string;
  isAvailable: boolean;
  image: string;      
  price: number;
  rating: {          
    rate: number;
    count: number;
  };
  category: string;  
};

export type TProductListItem = {
  id: string;
  name: string;
  category: {
    id: string;
    name: string;
  };
};

export type TProductPageInfo = {
  id: string;
  name: string;
  isAvailable: boolean;
  desc: string | null;
  images: string[];
  optionSets: string[];
  specialFeatures: string[];
  price: number;
  salePrice: number | null;
  specifications: TSpecification[];
  path: TPath[];
};

export type TFilters = {
  stockStatus: "all" | "inStock" | "outStock";
  priceRange: {
    min: number;
    max: number;
  };
  categories: string[];  
  rating?: number;      
};


export type TAddProductFormValues = {
  name: string;
  isAvailable: boolean;
  specialFeatures: string[];
  categoryID: string;
  desc?: string;
  price: string;
  salePrice?: string;
  images: string[];
  specifications: TSpecification[];
};

export type TCartListItemDB = {
  id: string;
  name: string;
  images: string[];
  price: number;
  salePrice: number | null;
};

export const transformProduct = (apiProduct: TBaseProduct): TListItem => ({
  id: apiProduct.id,
  name: apiProduct.title,
  isAvailable: true,
  image: apiProduct.image,
  price: apiProduct.price,
  rating: apiProduct.rating,
  category: apiProduct.category
});

export const transformToProductBoard = (apiProduct: TBaseProduct): TProductBoard => ({
  id: apiProduct.id,
  name: apiProduct.title,
  isAvailable: true,
  shortDesc: apiProduct.description,
  price: apiProduct.price,
  rating: apiProduct.rating,
  defaultQuantity: 1
});

export const transformToProductPageInfo = (apiProduct: TBaseProduct): TProductPageInfo => ({
  id: apiProduct.id.toString(),
  name: apiProduct.title,
  isAvailable: true,
  desc: apiProduct.description,
  images: [apiProduct.image],
  optionSets: [],
  specialFeatures: [],
  price: apiProduct.price,
  salePrice: null,
  specifications: [
    {
      groupName: "Details",
      specs: [
        { name: "Category", value: apiProduct.category },
        { name: "Rating", value: `${apiProduct.rating.rate}/5` },
        { name: "Reviews", value: `${apiProduct.rating.count} reviews` }
      ]
    }
  ],
  path: [
    {
      id: 'root',
      parentID: null,
      name: 'Home',
      url: '/'
    },
    {
      id: apiProduct.category.toLowerCase(),
      parentID: 'root',
      name: apiProduct.category,
      url: `/category/${apiProduct.category.toLowerCase()}`
    }
  ]
});

export const isBaseProduct = (product: any): product is TBaseProduct => {
  return (
    typeof product === 'object' &&
    'id' in product &&
    'title' in product &&
    'price' in product &&
    'description' in product &&
    'category' in product &&
    'image' in product &&
    'rating' in product
  );
};

export const generateProductUrl = (id: number | string): string => 
  `/product/${id}`;

export const formatPrice = (price: number): string => 
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);

export const calculateDiscount = (original: number, sale: number): number => 
  Math.round(((original - sale) / original) * 100);