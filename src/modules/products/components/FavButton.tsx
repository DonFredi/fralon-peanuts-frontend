import { Button } from "@/shared/components/ui/button";
import { Heart } from "lucide-react";

export default function FavButton() {
  return (
    <Button variant="ghost" className="absolute top-0 right-0 p-2 translate-x-1/4 -translate-y-1/4 transform">
      <Heart className="size-5" />
    </Button>
  );
}
