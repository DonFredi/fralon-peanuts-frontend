import { H4, P } from "@/shared/components/ui/Typography";
import { cn } from "@/shared/lib/utils";
import type { FC } from "react";

type ContactAction = {
  title: string;
  children: string;
  href: string;
  icon: FC;
  active?: boolean;
};
export default function ContactActionCard({ children, active, title, href, icon: Icon }: ContactAction) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "border border-foreground w-full flex flex-col gap-1 radius-card px-6 lg:px-8 py-4 items-center",
        active && "bg-secondary",
      )}
    >
      <Icon />
      <H4 className="">{title}</H4>
      <P>{children}</P>
    </a>
  );
}
