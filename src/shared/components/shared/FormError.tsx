import type { ReactNode } from "react";
import { P } from "../ui/Typography";
import { CircleX } from "lucide-react";

export default function FormError({ children }: { children: ReactNode }) {
  return (
    <div className="bg-red-200  rounded-md flex items-center gap-2 px-4 py-2.5 font-medium">
      <CircleX className="fill-destructive text-red-200" />
      <P className="text-destructive">{children}</P>
    </div>
  );
}
