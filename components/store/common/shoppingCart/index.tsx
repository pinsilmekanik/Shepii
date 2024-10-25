"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import styles from "./shoppingCart.module.scss";
import { CloseIcon, ShoppingIconEmpty } from "@/components/icons/svgIcons";
import CartItem from "./_components/cartItem";
import { api } from "@/lib/api";
import { RootState } from "@/store/shoppingCart";
import { TCartItemData } from "@/types/shoppingCart";

interface ShoppingCartProps {
  isVisible: boolean;
  handleOnClose: () => void;
}

const ShoppingCart = ({ isVisible, handleOnClose }: ShoppingCartProps) => {
  const [cartItems, setCartItems] = useState<TCartItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cart = useSelector((state: RootState) => state.cart);
  const quantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const loadCartItems = async () => {
      if (cart.items.length === 0) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const productIds = cart.items.map(item => item.productId);
        const products = await Promise.all(
          productIds.map(id => api.getProduct(id))
        );

        const cartItemsData: TCartItemData[] = products.map(product => {
          const cartItem = cart.items.find(item => item.productId === product.id);
          return {
            productId: product.id,
            productName: product.title,
            imgUrl: product.image,
            price: product.price,
            quantity: cartItem?.quantity || 0,
            rating: product.rating
          };
        });

        setCartItems(cartItemsData);
        setError(null);
      } catch (err) {
        setError('Failed to load cart items');
        console.error('Error loading cart items:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCartItems();
  }, [cart.items]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => 
      total + (item.price * item.quantity), 0
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div className={`${styles.shoppingCart} ${!isVisible && styles.shoppingHide}`}>
      <div 
        className={styles.background} 
        onClick={handleOnClose}
        role="button"
        aria-label="Close cart"
      />
      
      <div className={`${styles.cartWindow} ${isVisible && styles.showWindow}`}>
        <div className={styles.header}>
          <h2>Shopping Cart ({quantity})</h2>
          <button 
            onClick={handleOnClose}
            aria-label="Close cart"
          >
            <CloseIcon width={18} />
          </button>
        </div>

        <div className={styles.itemsContainer}>
          {loading ? (
            <div className={styles.loading}>Loading cart items...</div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : cartItems.length > 0 ? (
            <>
              {cartItems.map((item) => (
                <CartItem
                  key={item.productId}
                  data={item}
                  onLinkClicked={handleOnClose}
                />
              ))}
              <div className={styles.cartSummary}>
                <div className={styles.subtotal}>
                  <span>Subtotal</span>
                  <span>{formatPrice(calculateTotal())}</span>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.emptyContainer}>
              <div className={styles.icon}>
                <ShoppingIconEmpty width={36} />
              </div>
              <span>Your shopping cart is empty</span>
              <button 
                onClick={handleOnClose}
                className={styles.continueShoppingBtn}
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>

        <div className={styles.lowerSection}>
          {cartItems.length > 0 && (
            <>
              <div className={styles.total}>
                <span>Total</span>
                <span>{formatPrice(calculateTotal())}</span>
              </div>
              <button className={styles.checkout}>
                Proceed to Checkout
              </button>
              <button 
                onClick={handleOnClose}
                className={styles.continueShoppingBtn}
              >
                Continue Shopping
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;