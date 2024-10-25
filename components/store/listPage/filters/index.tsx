"use client";
import styles from "./filters.module.scss";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { CloseIcon } from "@/components/icons/svgIcons";
import { TFilters } from "@/types/product";
import CheckBox from "@/components/UI/checkBox";
import PriceSlider from "@/components/UI/priceSlider";
import { SK_Box } from "@/components/UI/skeleton";
import Button from "@/components/UI/button";
import { TPageStatus } from "@/types/list";
import { formatText } from "@/utils/text-helpers";

interface IProps {
  showFilters: boolean;
  filters: TFilters;
  pageStatus: TPageStatus;
  onToggleWindow: (value: boolean) => void;
  onFilterChange: (value: TFilters) => void;
  categories: string[];
  isFilterChanged?: boolean;
  onApplyFilter?: () => void;
}

const Filters = ({
  showFilters,
  filters,
  pageStatus,
  onToggleWindow,
  onFilterChange,
  categories,
  isFilterChanged = false,
  onApplyFilter = () => {},
}: IProps) => {
  const router = useRouter();
  
  
  const [pendingFilters, setPendingFilters] = useState<TFilters>(filters);
  
  
  useEffect(() => {
    setPendingFilters(filters);
  }, [filters]);

  const handlePriceChange = (value: [number, number]) => {
    setPendingFilters({
      ...pendingFilters,
      priceRange: { min: value[0], max: value[1] }
    });
  };

  const handleCategoryChange = (category: string) => {
    
    const formattedCategory = category.toLowerCase().replace(/\s+/g, '-');
    router.push(`/list/${formattedCategory}`);
  };

  const handleRatingChange = (rating: number) => {
    const newRating = pendingFilters.rating === rating ? undefined : rating;
    setPendingFilters({
      ...pendingFilters,
      rating: newRating
    });
  };

  const handleStockStatusChange = (status: "all" | "inStock") => {
    setPendingFilters({
      ...pendingFilters,
      stockStatus: status
    });
  };

  const handleApplyChanges = () => {
    onFilterChange(pendingFilters);
    onApplyFilter();
    onToggleWindow(false); 
  };

  const hasChanges = JSON.stringify(filters) !== JSON.stringify(pendingFilters);

  return (
    <div className={`${styles.filtersContainer} ${showFilters ? styles.showMobileFilters : ""}`}>
      <div className={styles.background} onClick={() => onToggleWindow(false)} />

      <div className={styles.filtersWindow}>
        <div className={styles.header}>
          <h2>Filters</h2>
          <button onClick={() => onToggleWindow(false)}>
            <CloseIcon width={12} />
          </button>
        </div>

        <div className={styles.eachFilter}>
          <div className={styles.header}>
            <h3>Availability</h3>
          </div>
          <div className={styles.body}>
            <CheckBox
              text="All"
              onClick={() => handleStockStatusChange("all")}
              isChecked={pendingFilters.stockStatus === "all"}
            />
            <CheckBox
              text="In Stock"
              onClick={() => handleStockStatusChange("inStock")}
              isChecked={pendingFilters.stockStatus === "inStock"}
            />
          </div>
        </div>

        <div className={styles.eachFilter}>
          <div className={styles.header}>
            <h3>Price</h3>
          </div>
          <div className={styles.body}>
            <PriceSlider
              sliderValues={[pendingFilters.priceRange.min, pendingFilters.priceRange.max]}
              minMaxLimit={[0, 1000]}
              pageStatus={pageStatus}
              onChange={handlePriceChange}
            />
          </div>
        </div>

        <div className={styles.eachFilter}>
          <div className={styles.header}>
            <h3>Categories</h3>
          </div>
          <div className={styles.body}>
            {pageStatus === "pageLoading" ? (
              <div className={styles.loadingBrands}>
                <SK_Box width="100%" height="20px" />
                <SK_Box width="100%" height="20px" />
                <SK_Box width="100%" height="20px" />
              </div>
            ) : pageStatus === "categoryHasNoProduct" ? (
              <div className={styles.optionsList} />
            ) : (
              <div className={styles.optionsList}>
                {categories.map((category) => (
                  <CheckBox
                    key={category}
                    isChecked={false}
                    text={formatText.formatCategory(category)}
                    onClick={() => handleCategoryChange(category)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.eachFilter}>
          <div className={styles.header}>
            <h3>Rating</h3>
          </div>
          <div className={styles.body}>
            {[4, 3, 2, 1].map((rating) => (
              <CheckBox
                key={rating}
                text={`${rating}+ Stars`}
                isChecked={pendingFilters.rating === rating}
                onClick={() => handleRatingChange(rating)}
              />
            ))}
          </div>
        </div>

        <div className={styles.apply}>
          <Button
            text="Apply Changes"
            disabled={!hasChanges}
            onClick={handleApplyChanges}
          />
        </div>
      </div>
    </div>
  );
};

export default Filters;