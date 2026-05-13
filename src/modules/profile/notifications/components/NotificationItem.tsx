import { Button } from "@/shared/components/ui/button";
import { P } from "@/shared/components/ui/Typography";

export default function NotificationItem() {
  return (
    <div className="border-b border-foreground-border px-2 py-4 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <P className="font-semibold text-lg text-foreground-heading">Order Completed</P>
        <small className="text-caption-base text-foreground-caption">Mar 12, 2026</small>
      </div>
      <P className="">Your order of ID #660874357898 has been completed and ready for pick up anytime you are ready</P>
      <Button variant="ghost" className="self-end p-2 rounded-xs text-primary">
        View Order
      </Button>
    </div>
  );
}
