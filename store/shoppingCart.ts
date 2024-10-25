import { PayloadAction, configureStore, createSlice } from "@reduxjs/toolkit";
import { TCartItem, TCartItemData } from "@/types/shoppingCart";
import { loadState, saveState } from "./storeLocalStorage";

export interface ICartState {
  items: TCartItemData[];
  isVisible: boolean;
}

type QuantityChange = {
  productId: number;  
  amount: number;
};

const initialState: ICartState = { isVisible: false, items: [] };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    add: (state: ICartState, action: PayloadAction<TCartItemData>) => {
      const isAvailable = state.items.findIndex(
        (item) => item.productId === action.payload.productId
      );
      if (isAvailable > -1) {
        state.items[isAvailable].quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      state.isVisible = true;
    },
    toggleCart: (state: ICartState, action: PayloadAction<boolean>) => {
      state.isVisible = action.payload;
    },
    remove: (state: ICartState, action: PayloadAction<number>) => {  
      state.items = state.items.filter(
        (item) => item.productId !== action.payload
      );
    },
    modifyQuantity: (
      state: ICartState,
      action: PayloadAction<QuantityChange>
    ) => {
      state.items = state.items.map((item) => {
        if (item.productId === action.payload.productId) {
          return {
            ...item,
            quantity: item.quantity + action.payload.amount
          };
        }
        return item;
      }).filter(item => item.quantity > 0); 
    },
  },
});

export const shoppingCartStore = configureStore({
  reducer: {
    cart: cartSlice.reducer,
  },
  preloadedState: loadState(),
});

shoppingCartStore.subscribe(() => {
  saveState(shoppingCartStore.getState());
});

export type RootState = ReturnType<typeof shoppingCartStore.getState>;
export type AppDispatch = typeof shoppingCartStore.dispatch;

export const { add, remove, modifyQuantity, toggleCart } = cartSlice.actions;