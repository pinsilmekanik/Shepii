import { TCollectionCard } from "@/types/collections";
import { TDealCard, TProductCard, TSlide, TBlogCard } from "@/types/common";

export const CollectionsData: TCollectionCard[] = [
  {
    name: "Electronics",
    collections: [
      {
        label: "Smartphones",
        url: "/category/electronics/smartphones",
      },
      {
        label: "Laptops",
        url: "/category/electronics/laptops",
      },
      {
        label: "Tablets",
        url: "/category/electronics/tablets",
      }
    ],
    imgUrl: "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg",
    url: "/category/electronics",
  },
  {
    name: "Jewelry",
    collections: [
      {
        label: "Rings",
        url: "/category/jewelery/rings",
      },
      {
        label: "Necklaces",
        url: "/category/jewelery/necklaces",
      }
    ],
    imgUrl: "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg",
    url: "/category/jewelery",
  },
  {
    name: "Men's Clothing",
    collections: [
      {
        label: "T-Shirts",
        url: "/category/men's clothing/t-shirts",
      },
      {
        label: "Jackets",
        url: "/category/men's clothing/jackets",
      }
    ],
    imgUrl: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
    url: "/category/men's clothing",
  },
  {
    name: "Women's Clothing",
    collections: [
      {
        label: "Dresses",
        url: "/category/women's clothing/dresses",
      },
      {
        label: "Jackets",
        url: "/category/women's clothing/jackets",
      }
    ],
    imgUrl: "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg",
    url: "/category/women's clothing",
  }
];

export const TodayDeals: TDealCard[] = [
  {
    id: 1,
    name: "Fjallraven Backpack",
    imgUrl: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    price: 109.95,
    dealPrice: 89.95,
    specs: ["Perfect for everyday use", "Fits 15\" laptop"],
    url: "/product/1",
    dealDate: new Date(),
    isAvailable: true,
    rating: {
      rate: 4.5,
      count: 120
    }
  },
  {
    id: 2,
    name: "Mens Casual T-Shirt",
    imgUrl: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
    price: 22.99,
    dealPrice: 18.99,
    specs: ["Slim fit", "Stylish design"],
    url: "/product/2",
    dealDate: new Date(),
    isAvailable: true,
    rating: {
      rate: 4.1,
      count: 259
    }
  }
];

export const TopProducts: TProductCard[] = [
  {
    id: 3,
    name: "Mens Cotton Jacket",
    imgUrl: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
    price: 55.99,
    specs: ["Great for all occasions", "Lightweight"],
    url: "/product/3",
    isAvailable: true,
    rating: {
      rate: 4.7,
      count: 500
    }
  },
  {
    id: 4,
    name: "Women's T-Shirt",
    imgUrl: "https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg",
    price: 12.99,
    specs: ["Moisture wicking", "Breathable"],
    url: "/product/4",
    isAvailable: true,
    rating: {
      rate: 4.5,
      count: 146
    }
  }
];

export const SlidesData: TSlide[] = [
  {
    imgUrl: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    url: "/product/1",
    alt: "Fjallraven Backpack",
    msg: {
      title: "FEATURED BACKPACK",
      buttonText: "Shop now!",
      desc: "Perfect for everyday use"
    }
  },
  {
    imgUrl: "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg",
    url: "/category/jewelery",
    alt: "Jewelry Collection",
    msg: {
      title: "JEWELRY COLLECTION",
      buttonText: "View Collection",
      desc: "Elegant designs for every occasion"
    }
  },
];

export const BlogCardData: TBlogCard[] = [
  {
    title: "Latest Fashion Trends",
    imgUrl: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
    url: "#",
    shortText: "Discover the latest trends in men's and women's fashion. From casual wear to elegant designs, we've got you covered."
  },
  {
    title: "Electronics Guide 2024",
    imgUrl: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg",
    url: "#",
    shortText: "Your comprehensive guide to the latest electronics. Find the perfect gadgets for your lifestyle."
  },
  {
    title: "Summer Jewelry Collection",
    imgUrl: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
    url: "#",
    shortText: "Explore our new jewelry collection for summer. From rings to necklaces, we have everything you need to shine."
  }
];

export const transformFakeStoreProduct = (apiProduct: any): TProductCard => ({
  id: apiProduct.id,
  name: apiProduct.title,
  isAvailable: true,
  specs: apiProduct.description.split('. ').filter(Boolean),
  price: apiProduct.price,
  imgUrl: apiProduct.image,
  url: `/product/${apiProduct.id}`,
  rating: apiProduct.rating
});

export const transformToDealCard = (product: TProductCard, discount: number = 15): TDealCard => ({
  ...product,
  dealPrice: Number((product.price * (1 - discount / 100)).toFixed(2)),
  dealDate: new Date(),
  isAvailable: true
});

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

export const calculateDiscount = (original: number, deal: number): number => {
  return Math.round(((original - deal) / original) * 100);
};

export const generateProductUrl = (id: number): string => {
  return `/product/${id}`;
};