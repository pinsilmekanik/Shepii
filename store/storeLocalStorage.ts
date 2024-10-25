import { ICartState } from "./shoppingCart";

interface StoredState {
  cart: ICartState;
}

const localStorageName = "cartStore";

export const loadState = (): StoredState => {
  const initialState: StoredState = {
    cart: {
      items: [],
      isVisible: false,
    },
  };
  
  try {
    const serializedState = localStorage.getItem(localStorageName);
    if (!serializedState) return initialState;
    
    const parsedState = JSON.parse(serializedState);
    return {
      cart: {
        items: parsedState.cart.items,
        isVisible: false 
      }
    };
  } catch (error) {
    return initialState;
  }
};

export const saveState = (state: StoredState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(localStorageName, serializedState);
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
};