import styles from "./productCard.module.scss";
import Image from "next/image";
import Link from "next/link";
import { formatPrice, calculateDiscount } from "@/types/product";
import { formatText } from "@/utils/text-helpers";

type TProductCard = {
  name: string;
  imageUrl: [string, string];
  price: number;
  dealPrice?: number;
  specs?: string[];
  url: string;
  isAvailable: boolean;
  rating?: {
    rate: number;
    count: number;
  };
  staticWidth?: boolean;
};

const ProductCard = ({
  name,
  imageUrl,
  price,
  dealPrice,
  specs = [],
  url,
  isAvailable = true,
  rating,
  staticWidth = false,
}: TProductCard) => {
  return (
    <div 
      className={`${styles.productCard}`}
    >
        <Link
          href={url}
          className={`${styles.imageWrapper}`}
        >
          {!isAvailable && (
            <div className={styles.outOfStock}>
              <span>Out of Stock</span>
            </div>
          )}
          <Image
              src={imageUrl[0]}
              alt="Product image - 1"
              fill
              sizes="(max-width: 220px) 100vw"
              quality={75}
              priority
            />
            <Image
              src={imageUrl[0]}
              alt="Product image - 2"
              fill
              sizes="(max-width: 220px) 100vw"
              quality={75}
              priority
            />
        </Link>
        <Link
          href={url}
          className={styles.title}
        >
          <span>{formatText.formatProductName(name)}</span>
        </Link>
        {specs && specs.length > 0 && (
          <div className={styles.specWrapper}>
            {specs.map((spec, index) => (
              <span key={index} className={styles.spec}>
                {formatText.formatProductName(spec)}
              </span>
            ))}
          </div>
        )}

        {rating && (
          <div className={styles.rating}>
            <div className={styles.stars}>
              {Array.from({ length: 5 }).map((_, index) => (
              <span 
                key={index}
                className={index < Math.floor(rating.rate) ? styles.filled : styles.unfilled}
                style={{ color: index < Math.floor(rating.rate) ? '#FFD700' : '#C0C0C0' }}
              >
                ★
              </span>
              ))}
            </div>
            <span className={styles.count}>({rating.count})</span>
          </div>
        )}

        <div className={styles.bottomSection}>
          <div className={styles.priceWrapper}>
            {dealPrice ? (
              <>
                <div className={styles.oldPrice}>
                  <span className={styles.discount}>
                    -{calculateDiscount(price, dealPrice)}%
                  </span>
                  <span className={styles.originalPrice}>
                    was {formatPrice(price)}
                  </span>
                </div>
                <span className={styles.mainPrice}>
                  {formatPrice(dealPrice)}
                </span>
              </>
            ) : (
              <span className={styles.mainPrice}>
                {formatPrice(price)}
              </span>
            )}
          </div>
          
          <div className={styles.basketWrapper}>
            <button 
              className={styles.addFavorite}
              aria-label="Add to favorites"
              disabled={!isAvailable}
            />
          </div>
        </div>
    </div>
  );
};

export default ProductCard;