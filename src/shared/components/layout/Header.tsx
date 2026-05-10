import dynamic from "next/dynamic";
import SectionWrapper from "../shared/SectionWrapper";
import Navbar from "./nav/Navbar";
import LogoutButton from "@/modules/auth/logout/components/LogoutButton";
import Badge from "../shared/Badge";
import ProfileButton from "./nav/components/ProfileButton";
import OpenCartButton from "./nav/components/OpenCartButton";
const MobileNav = dynamic(() => import("./nav/MobileNav"));

export default function Header() {
  return (
    <header className="py-1">
      <SectionWrapper className="flex items-center justify-between">
        <div className="flex items-center w-fit gap-1">
          <div className="md:hidden">
            <MobileNav />
          </div>
          <Badge />
        </div>

        <div className="hidden md:flex items-center gap-2 lg:gap-4">
          <Navbar />
          <LogoutButton>Log Out</LogoutButton>
        </div>

        <div className="flex items-center w-fit gap-1">
          <ProfileButton />
          <OpenCartButton />
        </div>
      </SectionWrapper>
    </header>
  );
}
