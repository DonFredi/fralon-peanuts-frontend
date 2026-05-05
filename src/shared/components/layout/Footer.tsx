import SectionWrapper from "../shared/SectionWrapper";
import Navbar from "./nav/Navbar";
import Copyright from "../shared/Copyright";
import SocialNav from "../socials/SocialNav";
import Badge from "../shared/Badge";

export default function Footer() {
  return (
    <footer className="">
      <SectionWrapper className="flex flex-col gap-4 items-center">
        <Badge />
        <Navbar />
        <SocialNav />
        <Copyright />
      </SectionWrapper>
    </footer>
  );
}
