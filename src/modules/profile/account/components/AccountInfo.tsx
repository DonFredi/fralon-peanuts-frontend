import type { User } from "@/modules/auth/shared/types";
import { H5, P } from "@/shared/components/ui/Typography";
import { Award } from "lucide-react";
import type { ProfileWithAddresses } from "../me/update-profile/update-profile.types";

export default function AccountInfo({ user }: { user: ProfileWithAddresses | null }) {
  return (
    <div className="border border-foreground-border radius-card p-4 gap-4 sm:p-6 flex items-center justify-between">
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="w-12 h-12 rounded-full bg-secondary uppercase font-black text-2xl text-primary flex flex-col items-center justify-center">
          {user?.full_name?.charAt(0)}
        </div>
        <div className="">
          <H5>{user?.full_name}</H5>
        </div>
      </div>
      <span className="flex items-center gap-2">
        <Award />
        <P>{user?.membership}</P>
      </span>
    </div>
  );
}
