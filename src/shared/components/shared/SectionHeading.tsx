import type { ReactNode } from "react";
import { H2 } from "../ui/Typography";
import { twMerge } from "tailwind-merge";
import SectionCaption from "./SectionCaption";

interface SectionHeadingProps {
  children: ReactNode;
  className?: string;
  caption?: ReactNode;
  captionClassName?: string;
  containerClassName?: string;
}

export default function SectionHeading({
  children,
  className,
  caption,
  captionClassName,
  containerClassName,
}: SectionHeadingProps) {
  if (caption) {
    return (
      <div className={twMerge("flex flex-col gap-2", containerClassName)}>
        <SectionCaption className={captionClassName}>{caption}</SectionCaption>
        <H2 className={twMerge("capitalize", className)}>{children}</H2>
      </div>
    );
  }

  return <H2 className={twMerge("capitalize", className)}>{children}</H2>;
}
