import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shepii - Product",
};

const ProductLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default ProductLayout;
