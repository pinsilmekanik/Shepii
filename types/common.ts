export type TProductCard = {
  id: number;           
  name: string;         
  isAvailable: boolean; 
  specs: string[];      
  price: number;
  dealPrice?: number;   
  imgUrl: string;       
  url: string;          
  rating: {            
    rate: number;
    count: number;
  };
};

export type TDealCard = TProductCard & {
  dealDate: Date;
  dealPrice: number;
};

export type TBlogCard = {
  title: string;
  imgUrl: string;
  url: string;
  shortText: string;
};

export type TSlide = {
  imgUrl: string;
  url: string;
  alt: string;
  msg?: {
    title: string;
    desc?: string;
    buttonText?: string;
  };
};


export type TCategory = {
  name: string;
  url: string;
  iconUrl?: string;
  iconSize?: [number, number];
};


export type TSpecGroup = {
  id: string;
  title: string;
  specs: string[];
};

export type TSingleSpec = {
  specGroupID: string;
  value: string;
};

export enum PageType {
  MAIN = "MAIN",
  LIST = "LIST",
  PRODUCT = "PRODUCT"
}

export interface VisitMetadata {
  userAgent: string;
  viewport: string;
  deviceType: 'mobile' | 'desktop';
  timestamp: string;
  referrer: string;
}

export interface TAddPageVisit {
  pageType: PageType;
  pagePath?: string;
  productID?: string;
  deviceResolution?: string;
  metadata?: VisitMetadata;
}

export interface PageVisit extends TAddPageVisit {
  id: string;
  timestamp: Date;
  sessionId?: string;
}

// Helper function to validate PageType
export const isValidPageType = (type: string): type is PageType => {
  return Object.values(PageType).includes(type as PageType);
};

// Helper function to get page type from URL
export const getPageTypeFromUrl = (url: string): PageType => {
  if (url === '/' || url === '/home') return PageType.MAIN;
  if (url.startsWith('/product/')) return PageType.PRODUCT;
  return PageType.LIST;
};