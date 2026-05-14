import { P } from "@/shared/components/ui/Typography";
import { Expand } from "lucide-react";

export default function OrderHistoryItem() {
  return (
    <div className="border border-foreground-border radius-card p-4 flex flex-col gap-1">
      <div className="flex items-center justify-between gap-4">
        <P className="font-semibold">Order#: 66sdas6uyf9dsau30dh7s9</P>
        <Expand className="size-5 text-foreground-border" />
      </div>
      <small className="text-caption-base text-foreground-caption">
        Status : <span className="text-success">Delivered</span>
      </small>
      <div className="flex items-center justify-between gap-4">
        <small className="text-caption-base text-foreground-caption">Mar 12, 2026, 3:30pm</small>
        <P className="font-semibold">ksh 2500</P>
      </div>
    </div>
  );
}
