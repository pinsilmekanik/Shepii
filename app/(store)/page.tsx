"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";

import HomeCategoryList from "@/components/store/home/categories";
import HomeSlider from "@/components/store/home/slider";
import TodayDealCard from "@/components/store/home/todayDealCard";
import WideAd from "@/components/store/home/wideAd";
import CollectionCard from "@/components/store/home/collectionCard";
import ProductCard from "@/components/store/common/productCard";
import { api } from "@/lib/api";
import { TBaseProduct } from "@/types/product";
import { formatText } from "@/utils/text-helpers";
import {
  BlogCardData,
} from "@/data/homepageData";
import HomeBlogCard from "@/components/store/home/blogCard";


export default function Home() {
  const [products, setProducts] = useState<TBaseProduct[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          api.getAllProducts(),
          api.getCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Get top rated products for deals
  const topDeals = products
    .sort((a, b) => b.rating.rate - a.rating.rate)
    .slice(0, 5)
    .map(product => ({
      name: product.title,
      price: product.price,
      dealPrice: product.price * 0.8, // 20% discount
      imgUrl: product.image,
      specs: [product.category],
      dealDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      url: `/product/${product.id}`
    }));

  // Get collections based on categories
  const collections = categories.map(category => ({
    name: formatText.formatCategory(category),
    collections: [
      {
        label: `${formatText.formatCategory(category)} Trending`,
        url: `/list/${category.toLowerCase().replace(/\s+/g, '-')}`
      },
      {
        label: `New ${formatText.formatCategory(category)}`,
        url: `/list/${category.toLowerCase().replace(/\s+/g, '-')}`
      }
    ],
    imgUrl: products.find(p => p.category === category)?.image || '/images/images/placeholder.png',
    url: `/list/${category.toLowerCase().replace(/\s+/g, '-')}`
  }));

  // Get top selling products
  const topProducts = products
    .sort((a, b) => b.rating.count - a.rating.count)
    .slice(0, 5)
    .map(product => ({
      name: product.title,
      imgUrl: product.image,
      price: product.price,
      specs: [product.category, `Rating: ${product.rating.rate}/5`],
      url: `/product/${product.id}`,
      rating: product.rating
    }));

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.homePage}>
      <div className="storeContainer flexCol">
        <div className={styles.heroContainer}>
          <HomeCategoryList />
          {products.length > 0 && <HomeSlider products={products.slice(0, 5)} />}
        </div>

        {/* Featured Categories */}
        <div className={styles.wideAdContainer}>
          {categories.slice(0, 3).map((category, index) => (
            <WideAd
              key={index}
              imgUrl={products.find(p => p.category === category)?.image || '/images/images/placeholder.png'}
              smallTitle={category}
              title={`Shop ${category}`}
              url={`/list/${category.toLowerCase().replace(/\s+/g, '-')}`}
            />
          ))}
        </div>

        {/* Today's Deals */}
        <div className={styles.homeSection}>
          <div className={styles.sectionHeader}>
            <h2>Today's Deals</h2>
            <Link href="/list">view all</Link>
          </div>
          <div className={styles.cardsWrapper}>
            {topDeals.map((deal, index) => (
              <TodayDealCard
                key={index}
                productName={deal.name}
                oldPrice={deal.price}
                newPrice={deal.dealPrice}
                image={[deal.imgUrl, deal.imgUrl]}
                spec={deal.specs}
                dealEndTime={deal.dealDate}
                url={deal.url}
              />
            ))}
          </div>
        </div>

        {/* Collections */}
        <div className={styles.homeSection}>
          <div className={styles.sectionHeader}>
            <h2>Collections</h2>
          </div>
          <div className={styles.cardsWrapper}>
            {collections.map((collection, index) => (
              <CollectionCard key={index} collection={collection} />
            ))}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className={styles.homeSection}>
          <div className={styles.sectionHeader}>
            <h2>Top Selling Products</h2>
            <Link href="/list">view all</Link>
          </div>
          <div className={styles.cardsWrapper}>
            {topProducts.map((product, index) => (
              <ProductCard
                key={index}
                name={product.name.split(" ").slice(0, 3).join(" ")}
                imageUrl={[product.imgUrl, product.imgUrl]}
                price={product.price}
                dealPrice={product.price * 0.8}
                isAvailable={true}
                specs={product.specs}
                url={product.url}
                rating={product.rating}
                staticWidth={true}
              />
            ))}
          </div>
        </div>
        <div className={styles.homeSection} style={{ marginBottom: 100 }}>
          <div className={styles.sectionHeader}>
            <h2>Latest Posts</h2>
          </div>
          <div className={styles.blogCardContainer}>
            {BlogCardData.map((blog, index) => (
              <HomeBlogCard
                key={index}
                imgUrl={blog.imgUrl}
                title={blog.title}
                shortText={blog.shortText}
                url={blog.url}
              />
            ))}
          </div>
        </div>
        {/* Featured Categories Section */}
        {/* <div className={styles.companiesSection}>
          <h2>Featured Categories</h2>
          <div className={styles.categoryGrid}>
            {categories.map((category, index) => (
              <Link 
                key={index} 
                href={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                className={styles.categoryItem}
              >
                {category}
              </Link>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
}