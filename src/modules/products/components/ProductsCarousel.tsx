import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/components/ui/carousel";
import ProductCard from "./ProductCard";

export default function ProductsCarousel() {
  return (
    <Carousel className="flex flex-col gap-6">
      <CarouselContent className="flex items-center">
        {[...Array(8)].map((_, index) => (
          <CarouselItem key={index} className="w-fit md:pl-6 pl-4">
            <ProductCard />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="w-fit mr-[6%] md:mr-[10%] self-center flex items-center justify-between gap-4">
        <CarouselPrevious variant="ghost" className="p-5 border border-primary text-border" />
        <CarouselNext variant="ghost" className="p-5 border border-primary text-border" />
      </div>
    </Carousel>
  );
}
