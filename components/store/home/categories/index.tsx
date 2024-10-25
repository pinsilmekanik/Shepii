"use client";
import styles from "./homeCategoryList.module.scss";
import { useEffect, useState } from "react";
import CategoryListItem from "./_components/catListItem";
import { SK_Box } from "@/components/UI/skeleton";
import { api } from "@/lib/api";
import { TGroupJSON } from "@/types/categories";
import { formatText } from "@/utils/text-helpers";

const HomeCategoryList = () => {
  const [categoryGroups, setCategoryGroups] = useState<TGroupJSON[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await api.getCategories();
        
        const transformedGroups: TGroupJSON[] = categories.map(category => {
          const capitalizedCategory = formatText.formatCategory(category);
          return {
            group: {
              id: category.toLowerCase().replace(/\s+/g, '-'),
              name: capitalizedCategory,
              url: `${category.toLowerCase().replace(/\s+/g, '-')}`,
              parentID: null,
              iconUrl: null,
              iconSize: [18, 18]
            },
            categories: [
              {
          category: {
            id: `${category}-new`,
            name: `New ${capitalizedCategory}`,
            url: ``,
            parentID: category.toLowerCase().replace(/\s+/g, '-'),
            iconUrl: null,
            iconSize: [18, 18]
          },
          subCategories: []
              },
              {
          category: {
            id: `${category}-featured`,
            name: `Featured ${capitalizedCategory}`,
            url: ``,
            parentID: category.toLowerCase().replace(/\s+/g, '-'),
            iconUrl: null,
            iconSize: [24, 24]
          },
          subCategories: []
              }
            ]
          };
        });

        setCategoryGroups(transformedGroups);
        setError(null);
      } catch (error) {
        console.error('Error loading categories:', error);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) {
    return (
      <div className={styles.categoriesContainer}>
        <ul>
          <div className={styles.loading}>
            {Array(8).fill(0).map((_, i) => (
              <SK_Box key={i} width="100%" height="16px" />
            ))}
          </div>
        </ul>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.categoriesContainer}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.categoriesContainer}>
      <ul>
        {categoryGroups.map((item, index) => (
          <CategoryListItem key={index} categoryData={item} />
        ))}
      </ul>
    </div>
  );
};

export default HomeCategoryList;