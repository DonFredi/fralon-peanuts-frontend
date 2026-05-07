import { H5, P } from "@/shared/components/ui/Typography";
import { cn } from "@/shared/lib/utils";

export default function IdentityCard({
  title,
  children,
  active,
}: {
  title: string;
  children: string;
  active?: boolean;
}) {
  return (
    <div
      className={cn("flex flex-col gap-2 p-6 radius-card max-w-140 border border-foreground", active && "bg-secondary")}
    >
      <H5>{title}</H5>
      <P className="text-caption-base">{children}</P>
    </div>
  );
}
