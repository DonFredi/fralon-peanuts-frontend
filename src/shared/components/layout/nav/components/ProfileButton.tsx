"use client";
import { Button } from "@/shared/components/ui/button";
import { UserRound } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfileButton() {
  const router = useRouter();
  return (
    <Button onClick={() => router.push("/profile")} variant="ghost" className="rounded-sm p-2">
      <UserRound className="size-6" />
    </Button>
  );
}
