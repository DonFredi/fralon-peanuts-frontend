import Logo from "@/shared/icons/Logo";
import Link from "next/link";

export default function Badge() {
  return (
    <Link href="/" className="py-1 px-2 rounded-sm">
      <Logo />
    </Link>
  );
}
