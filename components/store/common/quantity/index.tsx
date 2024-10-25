"use client";
import { MinusIcon, PlusIcon } from "@/components/icons/svgIcons";
import styles from "./quantity.module.scss";

interface IProps {
  quantity: number;
  iconWidth?: number;
  onChange: (isReducing: boolean) => void;
  maxQuantity?: number;  
}

const Quantity = ({ 
  onChange, 
  quantity, 
  iconWidth = 12,
  maxQuantity = 999 
}: IProps) => {
  return (
    <div className={styles.quantity}>
      <button 
        onClick={() => onChange(true)} 
        disabled={quantity === 1}
        aria-label="Decrease quantity"
      >
        <MinusIcon width={iconWidth} />
      </button>
      <span
        style={{
          fontSize: iconWidth * 2,
          width: iconWidth * 1.6,
        }}
      >
        {quantity}
      </span>
      <button 
        onClick={() => onChange(false)}
        disabled={quantity >= maxQuantity}
        aria-label="Increase quantity"
      >
        <PlusIcon width={iconWidth} />
      </button>
    </div>
  );
};

export default Quantity;