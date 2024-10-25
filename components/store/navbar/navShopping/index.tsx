"use client";
import styles from "./navShopping.module.scss";
import ShoppingCart from "../../common/shoppingCart";
import { ShoppingIconOutline } from "@/components/icons/svgIcons";
import { useDispatch, useSelector } from "react-redux";
import { ICartState, RootState } from "@/store/shoppingCart";
import { toggleCart } from "@/store/shoppingCart";
import { useEffect, useState } from "react";

const NavBarShopping = () => {
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  const cart = useSelector((state: RootState) => state.cart);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  const cartItemQuantity = mounted
    ? cart.items.reduce((total, item) => total + item.quantity, 0)
    : 0;

  const handleCartVisibility = (visibility: boolean) => {
    dispatch(toggleCart(visibility));
    visibility
      ? document.documentElement.classList.add("noScroll")
      : document.documentElement.classList.remove("noScroll");
  };

  if (!mounted) {
    return (
      <div className={styles.shopping}>
        <button>
          <ShoppingIconOutline width={24} />
          <span className={styles.emptyCart}>0</span>
        </button>
      </div>
    );
  }

  return (
    <div className={styles.shopping}>
      <button onClick={() => handleCartVisibility(true)}>
        <ShoppingIconOutline width={24} />
        <span
          className={`${
            cartItemQuantity === 0 ? styles.emptyCart : styles.filledCart
          }`}
        >
          {cartItemQuantity}
        </span>
      </button>
      <ShoppingCart
        isVisible={cart.isVisible}
        handleOnClose={() => handleCartVisibility(false)}
      />
    </div>
  );
};

export default NavBarShopping;