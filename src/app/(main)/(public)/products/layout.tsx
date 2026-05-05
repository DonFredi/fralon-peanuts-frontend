import PageWrapper from "@/shared/components/shared/PageWrapper";
import { generateSEO } from "@/shared/lib/seo";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = generateSEO({
  title: "Products",
  description: "We sell web development ready made templates to global clients",
  url: "/products",
});

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return <PageWrapper>{children}</PageWrapper>;
}
