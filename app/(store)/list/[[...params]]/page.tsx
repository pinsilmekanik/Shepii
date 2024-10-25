"use client";
import styles from "./list.module.scss";
import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import ProductCard from "@/components/store/common/productCard";
import DropDownList from "@/components/UI/dropDown";
import LineList from "@/components/UI/lineList";
import Button from "@/components/UI/button";
import { SK_Box } from "@/components/UI/skeleton";
import NoItem from "@/components/store/listPage/noItem";
import Filters from "@/components/store/listPage/filters";

import { sortDropdownData } from "@/data/uiElementsData";
import { TListSort, TPageStatus } from "@/types/list";
import { TFilters, TListItem, transformProduct } from "@/types/product";
import { api } from '@/lib/api';

const defaultFilters: TFilters = {
  stockStatus: "all",
  priceRange: {
    min: 0,
    max: 1000
  },
  categories: [],
  rating: undefined
};

const sortData: TListSort[] = [
  { sortName: "id", sortType: "desc" },     // Newest - index 0
  { sortName: "id", sortType: "asc" },      // Oldest - index 1
  { sortName: "price", sortType: "desc" },  // Most Expensive - index 2
  { sortName: "price", sortType: "asc" },   // Cheapest - index 3
  { sortName: "title", sortType: "asc" }     // title - index 4
];

const ListPage = () => {
  const router = useRouter();
  const { params } = useParams<{ params: string[] }>();
  const pathName = usePathname();

  const [products, setProducts] = useState<TListItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [sortIndex, setSortIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<TFilters>(defaultFilters);
  const [isListLoading, setIsListLoading] = useState(true);

  const sortProducts = (products: TListItem[], sort: TListSort) => {
    return [...products].sort((a, b) => {
      switch (sort.sortName) {
        case 'price':
          return sort.sortType === 'asc' ? a.price - b.price : b.price - a.price;
        
        case 'title':
          return sort.sortType === 'asc' ? 
            a.name.localeCompare(b.name) : 
            b.name.localeCompare(a.name);
        
        case 'id':
          // Assuming newer items have higher IDs
          return sort.sortType === 'asc' ? 
            a.id - b.id : 
            b.id - a.id;
        
        default:
          return 0;
      }
    });
  };

  useEffect(() => {
    const loadProducts = async () => {
      setIsListLoading(true);
      try {
        let categoryName = params?.[params.length - 1] || '';
        categoryName = categoryName.replace(/-/g, ' ');

        // Get all products and categories
        const [productsRes, categoriesRes] = await Promise.all([
          categoryName ? 
            api.getProductsByCategory(categoryName) : 
            api.getAllProducts(),
          api.getCategories()
        ]);

        // Transform products using the provided transformer
        const transformedProducts: TListItem[] = productsRes.map(transformProduct);

        // Make sure we have a valid sort configuration
        const currentSort = sortData[sortIndex] || sortData[0];

        // Apply sorting
        const sortedProducts = sortProducts(transformedProducts, currentSort);

        // Apply filters
        const filteredProducts = applyFilters(sortedProducts, filters);

        setProducts(filteredProducts);
        setCategories(categoriesRes);
        setIsListLoading(false);
      } catch (error) {
        console.error('Error loading products:', error);
        router.push('/');
      }
    };

    loadProducts();
  }, [params, sortIndex, filters]);

  const applyFilters = (products: TListItem[], filters: TFilters) => {
    return products.filter(product => {
      // Price filter
      if (product.price < filters.priceRange.min || product.price > filters.priceRange.max) {
        return false;
      }

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false;
      }

      // Rating filter
      if (filters.rating && product.rating.rate < filters.rating) {
        return false;
      }

      // Stock status filter
      if (filters.stockStatus !== "all") {
        const inStock = product.isAvailable;
        if (filters.stockStatus === "inStock" && !inStock) return false;
        if (filters.stockStatus === "outStock" && inStock) return false;
      }

      return true;
    });
  };

  const getPageHeader = () => {
    if (!params?.length) return 'All Products';
    const pageName = params[params.length - 1].split("-");
    return pageName.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  };

  const getPageStatus = (): TPageStatus => {
    if (isListLoading) {
      if (showFilters) return "filterLoading";
      return "pageLoading";
    }
  
    if (products.length > 0) return "filledProductList";
  
    if (showFilters) return "filterHasNoProduct";
  
    return "categoryHasNoProduct";
  };

  const pageStatusJSX = {
    pageLoading: (
      <div className={styles.sklList}>
        {[...Array(6)].map((_, i) => (
          <div className={styles.item} key={i}>
            <SK_Box width="100%" height="160px" />
            <SK_Box width="70%" height="26px" />
            <div>
              <SK_Box width="40%" height="12px" />
              <SK_Box width="40%" height="12px" />
              <SK_Box width="40%" height="12px" />
            </div>
            <SK_Box width="60%" height="20px" />
          </div>
        ))}
      </div>
    ),
    filterLoading: (
      <div className={styles.sklList}>
        {[...Array(6)].map((_, i) => (
          <div className={styles.item} key={i}>
            <SK_Box width="100%" height="160px" />
            <SK_Box width="70%" height="26px" />
            <div>
              <SK_Box width="40%" height="12px" />
              <SK_Box width="40%" height="12px" />
              <SK_Box width="40%" height="12px" />
            </div>
            <SK_Box width="60%" height="20px" />
          </div>
        ))}
      </div>
    ),
    filledProductList: (
      <div className={styles.listContainer}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            imageUrl={[product.image, product.image]}
            price={product.price}
            isAvailable={product.isAvailable}
            rating={product.rating}
            specs={[]}
            url={`/product/${product.id}`}
          />
        ))}
      </div>
    ),
    filterHasNoProduct: (
      <div className={styles.noItemContainer}>
        <span>No products match your filters</span>
        <Button 
          text="Reset Filters" 
          onClick={() => setFilters(defaultFilters)} 
        />
      </div>
    ),
    categoryHasNoProduct: <NoItem pageHeader={getPageHeader()} />
  }[getPageStatus()];

  return (
    <div className={styles.listPage}>
      <div className={styles.header}>
        <h1>{getPageHeader()}</h1>
        <div className={styles.links}>
          <Link href="/">Home</Link>
          {params?.map((item, index) => (
            <Link 
              key={index} 
              href={`/list/${params.slice(0, index + 1).join('/')}`}
            >
              {item.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </Link>
          ))}
        </div>
      </div>

      <div className="storeContainer flexCol">
        <div className={styles.mobileFilter}>
          <button
            className={styles.filterBtn}
            onClick={() => setShowFilters(true)}
          >
            FILTERS
          </button>
          <DropDownList
            data={sortDropdownData}
            width="170px"
            selectedIndex={sortIndex}
            onChange={setSortIndex}
          />
        </div>

        <div className={styles.main}>
          <Filters
            onToggleWindow={setShowFilters}
            showFilters={showFilters}
            filters={filters}
            onFilterChange={setFilters}
            categories={categories}
            pageStatus={getPageStatus()}
          />
          
          <div className={styles.rightCol}>
            <div className={styles.sortContainer}>
              <Image
                src="/images/icons/sortIcon.svg"
                alt="Sort"
                width={16}
                height={12}
                priority
              />
              <span>Sort By:</span>
              <LineList
                data={sortDropdownData}
                selectedId={sortIndex}
                onChange={setSortIndex}
              />
            </div>
            {pageStatusJSX}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListPage;