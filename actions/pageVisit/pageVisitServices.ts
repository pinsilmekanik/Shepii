"use server";

import { z } from "zod";
import { TAddPageVisit, PageType } from "@/types/common";
import { api } from "@/lib/api";

const ValidatePageVisit = z.object({
  pageType: z.enum(["MAIN", "LIST", "PRODUCT"] as const),
  pagePath: z.string().optional(),
  productID: z.string().optional(),
  deviceResolution: z.string().optional(),
});

export type TTrafficListItem = {
  id: string;
  time: Date;
  pageType: PageType;
  pagePath: string | null;
  productID: string | null;
  deviceResolution: string | null;
  product: {
    name: string;
    category: {
      name: string;
    };
  } | null;
};

class VisitStore {
  private static instance: VisitStore;
  private visits: TTrafficListItem[] = [];

  private constructor() {}

  public static getInstance(): VisitStore {
    if (!VisitStore.instance) {
      VisitStore.instance = new VisitStore();
    }
    return VisitStore.instance;
  }

  async addVisit(data: TAddPageVisit): Promise<TTrafficListItem> {
    let productInfo = null;

    if (data.productID) {
      try {
        const product = await api.getProduct(Number(data.productID));
        productInfo = {
          name: product.title,
          category: {
            name: product.category
          }
        };
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    }

    const visit: TTrafficListItem = {
      id: `visit_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      time: new Date(),
      pageType: data.pageType,
      pagePath: data.pagePath || null,
      productID: data.productID || null,
      deviceResolution: data.deviceResolution || null,
      product: productInfo
    };

    this.visits.unshift(visit);
    if (this.visits.length > 1000) {
      this.visits = this.visits.slice(0, 1000);
    }

    return visit;
  }

  getVisits(): TTrafficListItem[] {
    return this.visits;
  }

  deleteVisit(id: string): TTrafficListItem | null {
    const visitIndex = this.visits.findIndex(v => v.id === id);
    if (visitIndex === -1) return null;

    const [deletedVisit] = this.visits.splice(visitIndex, 1);
    return deletedVisit;
  }
}

const visitStore = VisitStore.getInstance();

// Service functions
export const addVisit = async (data: TAddPageVisit) => {
  if (process.env.NODE_ENV !== "production") {
    console.log("Development mode - skipping visit tracking");
    return { res: null };
  }

  if (!ValidatePageVisit.safeParse(data).success) {
    return { error: "Invalid visit data" };
  }

  try {
    const result = await visitStore.addVisit(data);
    return { res: result };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};

export const getTrafficReport = async () => {
  try {
    const visits = visitStore.getVisits();
    return { res: visits };
  } catch (error) {
    return { error: "Failed to get traffic report" };
  }
};

export const deleteTraffic = async (id: string) => {
  if (!id || id === "") {
    return { error: "Invalid ID" };
  }

  try {
    const result = visitStore.deleteVisit(id);
    if (!result) {
      return { error: "Visit record not found" };
    }
    return { res: result };
  } catch (error) {
    return { error: "Failed to delete visit record" };
  }
};

// Additional analytics functions
export const getAnalytics = async () => {
  try {
    const visits = visitStore.getVisits();
    
    const analytics = {
      totalVisits: visits.length,
      byPageType: {
        [PageType.MAIN]: visits.filter(v => v.pageType === PageType.MAIN).length,
        [PageType.LIST]: visits.filter(v => v.pageType === PageType.LIST).length,
        [PageType.PRODUCT]: visits.filter(v => v.pageType === PageType.PRODUCT).length,
      },
      byDevice: visits.reduce((acc: Record<string, number>, visit) => {
        if (visit.deviceResolution) {
          acc[visit.deviceResolution] = (acc[visit.deviceResolution] || 0) + 1;
        }
        return acc;
      }, {}),
      topProducts: visits
        .filter(v => v.product)
        .reduce((acc: Record<string, number>, visit) => {
          if (visit.product) {
            acc[visit.product.name] = (acc[visit.product.name] || 0) + 1;
          }
          return acc;
        }, {}),
      topCategories: visits
        .filter(v => v.product?.category)
        .reduce((acc: Record<string, number>, visit) => {
          if (visit.product?.category) {
            acc[visit.product.category.name] = (acc[visit.product.category.name] || 0) + 1;
          }
          return acc;
        }, {})
    };

    return { res: analytics };
  } catch (error) {
    return { error: "Failed to generate analytics" };
  }
};

// Helper function to format visit data
export const formatVisitDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};