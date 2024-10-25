"use client";
import { useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { addVisit } from "@/actions/pageVisit/pageVisitServices";
import { PageType, TAddPageVisit } from "@/types/common";

const AddVisit = () => {
  const pathname = usePathname();

  const getDeviceInfo = useCallback(() => {
    return {
      resolution: `${window.screen.width}x${window.screen.height}`,
      userAgent: window.navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      deviceType: /mobile|tablet|ipad/i.test(window.navigator.userAgent) ? 'mobile' as const : 'desktop' as const
    };
  }, []);

  const getPageType = useCallback((path: string): PageType => {
    if (path.startsWith('/product/')) return PageType.PRODUCT;
    if (path.startsWith('/category/') || path.startsWith('/list/')) return PageType.LIST;
    return PageType.MAIN;
  }, []);

  const getProductId = useCallback((path: string): string | undefined => {
    const matches = path.match(/\/product\/(\d+)/);
    return matches?.[1];
  }, []);

  const trackPageVisit = useCallback(async () => {
    try {
      const deviceInfo = getDeviceInfo();
      const pageType = getPageType(pathname);
      
      const visitData: TAddPageVisit = {
        pageType,
        pagePath: pathname,
        deviceResolution: deviceInfo.resolution,
        metadata: {
          userAgent: deviceInfo.userAgent,
          viewport: deviceInfo.viewport,
          deviceType: deviceInfo.deviceType,
          timestamp: new Date().toISOString(),
          referrer: document.referrer
        }
      };

      // Add product ID for product pages
      if (pageType === 'PRODUCT') {
        const productId = getProductId(pathname);
        if (productId) {
          visitData.productID = productId;
        }
      }

      await addVisit(visitData);
      
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to track page visit:', error);
      }
    }
  }, [pathname, getDeviceInfo, getPageType, getProductId]);

  useEffect(() => {
    trackPageVisit();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        trackPageVisit();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Optional: Track when user returns to the page
    const handleFocus = () => {
      trackPageVisit();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [trackPageVisit]);

  return null;
};

export default AddVisit;

// Optional: Add performance tracking
export const withVisitTracking = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return function WithVisitTrackingComponent(props: P) {
    return (
      <>
        <AddVisit />
        <WrappedComponent {...props} />
      </>
    );
  };
};