import { TBaseProduct } from "./product";

export type TCartItem = {
  productId: number;    
  quantity: number;
};

export type TCartItemData = {
  productId: number;    
  productName: string;  
  imgUrl: string;      
  price: number;
  dealPrice?: number;
  quantity: number;
  rating?: {           
    rate: number;
    count: number;
  };
};


export const transformToCartItem = (
  product: TBaseProduct,
  quantity: number
): TCartItemData => ({
  productId: product.id,
  productName: product.title,
  imgUrl: product.image,
  price: product.price,
  quantity,
  rating: product.rating
});