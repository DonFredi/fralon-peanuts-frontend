import SectionHeading from "@/shared/components/shared/SectionHeading";
import SectionWrapper from "@/shared/components/shared/SectionWrapper";
import { P } from "@/shared/components/ui/Typography";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import ProductsCarousel from "../components/ProductsCarousel";

export default function ProductsSection() {
  return (
    <section className="relative overflow-hidden py-8 sm:py-12 lg:py-16">
      <div aria-hidden="true" className="absolute inset-x-0 top-1/2 -z-10 h-72 -translate-y-1/2 bg-primary/5" />
      <SectionWrapper className="flex flex-col gap-6 sm:gap-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-135">
            <SectionHeading caption="Fresh from Fralon">Our products</SectionHeading>
            <P className="mt-3 max-w-105 text-foreground-caption">
              Made from quality peanuts for spreading, snacking, and sharing.
            </P>
          </div>
          <Link
            href="/products"
            className="group flex w-fit items-center gap-2 text-body-base font-bold text-primary underline decoration-primary/30 underline-offset-6 transition hover:decoration-primary"
          >
            View all products
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </SectionWrapper>
      <div className="px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <ProductsCarousel />
      </div>
    </section>
  );
}
