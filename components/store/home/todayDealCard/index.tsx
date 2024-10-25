"use client";

import Image from "next/image";
import styles from "./todayDealCard.module.scss";
import Link from "next/link";
import { useState } from "react";
import { ClockIcon } from "@/components/icons/svgIcons";
import { formatText } from "@/utils/text-helpers";

interface IProps {
  productName: string;
  newPrice: number;
  oldPrice: number;
  image: [string, string];
  dealEndTime: Date;
  spec?: string[];
  url: string;
}

const TodayDealCard = ({
  productName,
  newPrice,
  oldPrice,
  image,
  dealEndTime,
  spec = [],
  url,
}: IProps) => {
  const saveAmount = oldPrice - newPrice;
  const [remainedTime, setRemainedTime] = useState(dealEndTime);

  setTimeout(() => {
    setRemainedTime(new Date(remainedTime.getTime() - 1000));
  }, 1000);

  return (
    <div className={styles.dealCard}>
      <Link href={url} className={styles.imgWrapper}>
        <Image
          src={image[0]}
          alt=''
          width={240}
          height={240}
        />
         <Image
          src={image[0]}
          alt=''
          width={240}
          height={240}
        />
      </Link>
      <div className={styles.save}>
        <span>Save </span>
        <span>
          ${saveAmount.toLocaleString("en-us", { minimumFractionDigits: 2 })}
        </span>
      </div>
      <Link href={url}>
        <h3>{formatText.formatProductName(productName.split(" ").slice(0, 3).join(" "))}</h3>
      </Link>
      <div className={styles.specWrapper}>
        {spec.length > 0 &&
          spec.map((item, index) => <span key={index}>{formatText.formatCategory(item)}</span>)}
      </div>
      <div className={styles.bottomWrapper}>
        <div className={styles.priceWrapper}>
          <span>
            was $
            {oldPrice.toLocaleString("en-us", {
              useGrouping: true,
              minimumFractionDigits: 2,
            })}
          </span>
          <span>
            $
            {newPrice.toLocaleString("en-us", {
              useGrouping: true,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
        <div className={styles.timeWrapper}>
          <ClockIcon width={14} />
          <span>
            {`${remainedTime
              .getHours()
              .toLocaleString("en-us", { minimumIntegerDigits: 2 })}
            :
            ${remainedTime
              .getMinutes()
              .toLocaleString("en-us", { minimumIntegerDigits: 2 })}
            :
            ${remainedTime
              .getSeconds()
              .toLocaleString("en-us", { minimumIntegerDigits: 2 })}`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TodayDealCard;
