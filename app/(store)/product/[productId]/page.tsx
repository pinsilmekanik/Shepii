"use client";
import styles from "./productPage.module.scss";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import ProductCard from "@/components/store/common/productCard";
import ProductBoard from "@/components/store/productPage/productBoard";
import Gallery from "@/components/store/productPage/gallery";
import { SK_Box } from "@/components/UI/skeleton";
import { LikeIcon, MinusIcon } from "@/components/icons/svgIcons";

import { api } from "@/lib/api";
import { TBaseProduct, TProductPageInfo } from "@/types/product";

import { formatText } from "@/utils/text-helpers";

const ProductPage = () => {
  const router = useRouter();
  const { productId } = useParams();
  const [productInfo, setProductInfo] = useState<TProductPageInfo | null>(null);
  const [similarProducts, setSimilarProducts] = useState<TBaseProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        if (!productId) {
          router.push("/");
          return;
        }

        const product = await api.getProduct(Number(productId));
        
        // Transform product data to match your interface
        const transformedProduct: TProductPageInfo = {
          id: product.id.toString(),
          name: product.title,
          isAvailable: true,
          desc: product.description,
          images: [product.image], // Single image from API
          optionSets: [],
          specialFeatures: [
            product.category,
            `Rating: ${product.rating.rate}/5`,
            `${product.rating.count} reviews`
          ],
          price: product.price,
          salePrice: null,
          specifications: [
            {
              groupName: "Product Details",
              specs: [
                { name: "Category", value: product.category },
                { name: "Rating", value: `${product.rating.rate}/5` },
                { name: "Reviews", value: `${product.rating.count} reviews` }
              ]
            }
          ],
          path: [
            {
              id: 'category',
              name: product.category,
              url: product.category.toLowerCase().replace(/\s+/g, '-'),
              parentID: null
            }
          ]
        };

        setProductInfo(transformedProduct);

        // Load similar products from same category
        const categoryProducts = await api.getProductsByCategory(product.category);
        setSimilarProducts(
          categoryProducts
            .filter(p => p.id !== product.id)
            .slice(0, 4)
        );

        setLoading(false);
      } catch (error) {
        console.error('Error loading product:', error);
        router.push("/");
      }
    };

    loadProduct();
  }, [productId, router]);

  if (!productInfo && !loading) return null;

  console.log(productInfo);

  return (
    <div className="storeContainer">
      <div className={styles.productPage}>
        <div className={styles.upperSection}>
          <div className={styles.leftSection}>
            <div className={styles.path}>
              {productInfo ? (
                <>
                  <Link href="/">Home</Link>
                  <Link href={`/category/${productInfo.path[0].url}`}>
                    {productInfo.path[0].name}
                  </Link>
                </>
              ) : (
                <SK_Box width="60%" height="15px" />
              )}
            </div>
            <Gallery images={productInfo?.images || []} />
          </div>

          <div className={styles.rightSection}>
            {productInfo ? (
              <ProductBoard
                boardData={{
                  id: productInfo.id,
                  isAvailable: productInfo.isAvailable,
                  defaultQuantity: 1,
                  name: productInfo.name,
                  price: productInfo.price,
                  dealPrice: productInfo.salePrice ?? undefined,
                  shortDesc: productInfo.desc || "",
                  specialFeatures: productInfo.specialFeatures,
                  rating: {
                    rate: parseFloat(productInfo.specifications[0].specs[1].value),
                    count: parseInt(productInfo.specifications[0].specs[2].value)
                  },
                  image: productInfo.images[0]
                }}
              />
            ) : (
              <div className={styles.boardLoading}>
                <SK_Box width="60%" height="14px" />
                <div className={styles.title}>
                  <SK_Box width="40%" height="30px" />
                  <SK_Box width="90%" height="16px" />
                </div>
                <div className={styles.desc}>
                  <SK_Box width="40%" height="14px" />
                  <SK_Box width="40%" height="14px" />
                  <SK_Box width="40%" height="14px" />
                </div>
                <div className={styles.price}>
                  <SK_Box width="30%" height="40px" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.lowerSection}>
          <div className={styles.leftSection}>
            {/* Specifications */}
            <div className={styles.specification}>
              <h2>Specification</h2>
              {productInfo ? (
                productInfo.specifications.map((spec, index) => (
                  <section key={index} className={styles.specGroup}>
                    <div className={styles.specGroupHead}>
                      <button>
                        <MinusIcon width={12} />
                      </button>
                      <h3>{spec.groupName}</h3>
                    </div>
                    {spec.specs.map((row, index) => (
                      <div key={index} className={styles.row}>
                        <div className={styles.leftCol}>
                          <span>{row.name}</span>
                        </div>
                        <div className={styles.rightCol}>
                          <span>{index === 0 ? formatText.formatCategory(row.value) : row.value}</span>
                        </div>
                      </div>
                    ))}
                  </section>
                ))
              ) : (
                <div className={styles.specLoading}>
                  <SK_Box width="200px" height="30px" />
                  <div className={styles.specs}>
                    <SK_Box width="10%" height="20px" />
                    <SK_Box width="40%" height="16px" />
                  </div>
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className={styles.userReviews}>
              <div className={styles.header}>
                <h2>User Reviews</h2>
                <button>New Review</button>
              </div>
              <div className={styles.reviewWrapper}>
                <div className={styles.head}>
                  <div className={styles.user}>
                    <Image
                      src={"/images/images/defaultUser.png"}
                      alt=""
                      width={32}
                      height={32}
                    />
                    <span>Ilham Y</span>
                  </div>
                  <span className={styles.isVerified}>Verified Purchase</span>
                  <div className={styles.dateAndLikeSection}>
                    <div className={styles.date}>25 October 2024</div>
                    <div className={styles.likeInteraction}>
                      <button className={styles.like}>
                        <LikeIcon width={16} />10
                      </button>
                      <button className={styles.dislike}>
                        <LikeIcon width={16} /> 0
                      </button>
                    </div>
                  </div>
                </div>
                <div className={styles.body}>
                  <span>
                    {`Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                    Temporibus suscipit debitis reiciendis repellendus! Repellat rem beatae quo quis 
                    tenetur. Culpa quae ratione delectus id odit in nesciunt saepe pariatur vitae.`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className={styles.similarProductSection}>
            <h2>Similar Products</h2>
            <div className={styles.cardsContainer}>
              {similarProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  name={product.title}
                  imageUrl={[product.image, product.image]}
                  price={product.price}
                  isAvailable={true}
                  rating={product.rating}
                  specs={[product.category]}
                  url={`/product/${product.id}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;