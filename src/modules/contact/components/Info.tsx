import { P } from "@/shared/components/ui/Typography";

export default function Info({ day, children }: { day: string; children: string }) {
  return (
    <div className="flex flex-col items-center">
      <P className="font-semibold text-background text-center">{day}</P>
      <small className="text-caption-base text-secondary text-center">{children}</small>
    </div>
  );
}
