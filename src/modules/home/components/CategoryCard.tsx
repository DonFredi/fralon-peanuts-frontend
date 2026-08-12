import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface CategoryCardProps {
  title: string;
  description: string;
  href: string;
  image: StaticImageData;
  imagePosition?: string;
}

export default function CategoryCard({ title, description, href, image, imagePosition = "center" }: CategoryCardProps) {
  return (
    <Link
      href={href}
      className="group relative isolate flex min-h-64 w-full overflow-hidden rounded-rad-xl bg-secondary p-5 text-background shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:min-h-80 sm:p-6"
    >
      <Image
        src={image}
        alt=""
        fill
        sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 30vw"
        className="-z-20 object-cover transition duration-500 group-hover:scale-105"
        style={{ objectPosition: imagePosition }}
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-foreground/95 via-foreground/45 to-foreground/5" />

      <div className="mt-auto flex w-full items-end justify-between gap-3">
        <div className="max-w-55">
          <p className="text-heading-sm font-bold text-background">{title}</p>
          <p className="mt-1 text-body-sm leading-snug text-background/75">{description}</p>
        </div>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-background text-foreground transition duration-300 group-hover:rotate-45 group-hover:bg-accent">
          <ArrowUpRight className="size-5" aria-hidden="true" />
          <span className="sr-only">View {title} products</span>
        </span>
      </div>
    </Link>
  );
}
