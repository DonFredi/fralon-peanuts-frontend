import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface SectionCaptionProps {
  children: ReactNode;
  className?: string;
}

export default function SectionCaption({ children, className }: SectionCaptionProps) {
  return (
    <p className={twMerge("text-body-sm font-bold uppercase tracking-[0.16em] text-primary", className)}>{children}</p>
  );
}
