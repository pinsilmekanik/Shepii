import styles from "./catListItem.module.scss";
import Image from "next/image";
import Link from "next/link";
import { TGroupJSON } from "@/types/categories";

const CategoryListItem = ({ categoryData }: { categoryData: TGroupJSON }) => {
  const { categories, group } = categoryData;

  // Generate placeholder icon if iconUrl is null
  const iconUrl = group.iconUrl 
    ? `/images/icons/${group.iconUrl}.svg`
    : '/images/icons/default-category.svg';  

  return (
    <li className={styles.categoryItem}>
      <Link href={`/list/${group.url}`}>
        <div className={styles.iconWrapper}>
          <Image
            src={iconUrl}
            alt={group.name}
            width={group.iconSize[0]}
            height={group.iconSize[1]}
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = '/images/icons/default-category.svg';
            }}
          />
        </div>
        {group.name}
      </Link>
      
      {categories && categories.length > 0 && (
        <>
          <div>
            <Image
              className={styles.arrow}
              src="/images/icons/arrowIcon01.svg"
              width={6}
              height={10}
              alt=""
              priority
            />
          </div>
          
          <div className={styles.subCat}>
            {categories.map((item, index) => (
              <div className={styles.catGroup} key={index}>
                <Link href={`/list/${group.url}/${item.category.url}`}>
                  {item.category.name}
                </Link>

                {item.subCategories?.length > 0 && (
                  <div className={styles.children}>
                    {item.subCategories.map((link, index) => (
                      <Link
                        key={index}
                        href={`/list/${group.url}/${item.category.url}/${link.url}`}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </li>
  );
};

export default CategoryListItem;