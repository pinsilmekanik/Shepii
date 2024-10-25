import { TBaseProduct } from "./product";

export type TDropDown = {
  value: string;
  text: string;
};

export type TLoadingState = 'idle' | 'loading' | 'success' | 'error';

export type TPagination = {
  page: number;
  limit: number;
  total: number;
};

export type TSortOption = {
  field: keyof TBaseProduct;
  direction: 'asc' | 'desc';
};