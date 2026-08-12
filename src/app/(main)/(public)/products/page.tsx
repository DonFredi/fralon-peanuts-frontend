import ProductsPage from "@/modules/products/pages/ProductsPage";

export default async function Products({ searchParams }: { searchParams: Promise<{ category?: string | string[] }> }) {
  const { category } = await searchParams;

  return <ProductsPage category={typeof category === "string" ? category : undefined} />;
}
