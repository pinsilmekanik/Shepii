"use client";
import styles from "./productBoard.module.scss";
import Link from "next/link";
import { useState } from "react";
import AddToCartButton from "../addToCartButton";
import { StarIcon, HeartIcon } from "@/components/icons/svgIcons";
import Quantity from "../../common/quantity";
import { TCartItemData } from "@/types/shoppingCart";

interface ProductBoardProps {
  boardData: {
    id: string;
    name: string;
    isAvailable: boolean;
    shortDesc: string;
    price: number;
    dealPrice?: number;
    specialFeatures?: string[];
    defaultQuantity: number;
    rating: {
      rate: number;
      count: number;
    };
    image: string;
  };
}

const ProductBoard = ({ boardData }: ProductBoardProps) => {
  const {
    id,
    name,
    isAvailable,
    specialFeatures = [],
    price,
    shortDesc,
    dealPrice,
    defaultQuantity,
    rating,
    image
  } = boardData;

  const [quantity, setQuantity] = useState(Math.max(defaultQuantity, 1));

  const handleQuantityChange = (isReducing: boolean) => {
    setQuantity(prev => {
      if (isReducing) {
        return prev > 1 ? prev - 1 : 1;
      }
      return prev + 1;
    });
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <StarIcon
        key={index}
        width={15}
        stroke="#856B0F"
        fill={index < Math.round(rating) ? "#FFD643" : "none"}
      />
    ));
  };

  const formatPrice = (amount: number) => {
    return amount.toLocaleString("en-US", {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    });
  };

  const cartProduct: TCartItemData = {
    productId: Number(id),
    productName: name,
    imgUrl: image,
    price: price,
    dealPrice: dealPrice,
    quantity: quantity,
    rating: rating
  };

  return (
    <div className={styles.productBoard}>
      <button className={styles.favorite} aria-label="Add to favorites">
        <HeartIcon width={22} />
      </button>

      <section>
        <div className={styles.stars}>
          {renderStars(rating.rate)}
          <Link href="#reviews">
            {rating.count} {rating.count === 1 ? 'Review' : 'Reviews'}
          </Link>
          {/* <span className={styles.rating}>
            {rating.rate.toFixed(1)} out of 5
          </span> */}
        </div>
      </section>

      <h1>{name}</h1>
      <span className={styles.shortDesc}>{shortDesc}</span>
      
      <hr />
      
      {specialFeatures.length > 0 && (
        <div className={styles.specialFeatures}>
          {specialFeatures.map((feature, index) => (
            <span key={index} className={styles.feature}>
              {feature}
            </span>
          ))}
        </div>
      )}

      <div className={styles.priceSection}>
        <h2 className={styles.price}>
          {formatPrice(dealPrice || price)}
        </h2>

        {dealPrice && (
          <div className={styles.dealPrice}>
            <span className={styles.dealAmount}>
              Save {formatPrice(price - dealPrice)}
            </span>
            <span className={styles.oldPrice}>
              Was {formatPrice(price)}
            </span>
          </div>
        )}
      </div>

      <hr />

      <section className={styles.addToCartSection}>
        <Quantity 
          onChange={handleQuantityChange} 
          quantity={quantity}
          maxQuantity={10}
          />
        <AddToCartButton 
          product={cartProduct}
          disabled={!isAvailable} 
        />
      </section>

      {!isAvailable && (
        <p className={styles.outOfStock}>
          This product is currently out of stock
        </p>
      )}
    </div>
  );
};

export default ProductBoard;