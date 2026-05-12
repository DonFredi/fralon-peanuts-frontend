import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { UserRound } from "lucide-react";
import Link from "next/link";

export function NoUserProfileDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="rounded-sm p-2">
          <UserRound className="size-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup className="flex flex-col gap-1">
          <Link href="/auth/login">
            <DropdownMenuItem className="py-2">Log in</DropdownMenuItem>
          </Link>
          <Link href="/auth/register">
            <DropdownMenuItem className="py-2">Create account</DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
