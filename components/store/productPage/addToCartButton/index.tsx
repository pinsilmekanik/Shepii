"use client";
import styles from "./addToCartButton.module.scss";
import { useDispatch } from "react-redux";
import { ShoppingIconFill } from "@/components/icons/svgIcons";
import { add } from "@/store/shoppingCart";
import { TCartItemData } from "@/types/shoppingCart";

interface AddToCartButtonProps {
  disabled: boolean;
  product: {
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
}

const AddToCartButton = ({ product, disabled }: AddToCartButtonProps) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    const cartItem: TCartItemData = {
      productId: product.productId,
      productName: product.productName,
      imgUrl: product.imgUrl,
      price: product.price,
      dealPrice: product.dealPrice,
      quantity: product.quantity,
      rating: product.rating
    };

    dispatch(add(cartItem));
    
    // Optional: Show cart or notification
    document.documentElement.classList.add("noScroll");
  };

  return (
    <button
      disabled={disabled}
      className={`${styles.addToCart} ${disabled ? styles.disabled : ''}`}
      onClick={handleAddToCart}
      aria-label={disabled ? "Product not available" : "Add to cart"}
    >
      {disabled ? (
        "Not Available"
      ) : (
        <>
          <ShoppingIconFill width={16} />
          <span>Add to Cart</span>
        </>
      )}
    </button>
  );
};

export default AddToCartButton;