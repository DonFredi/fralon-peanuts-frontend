import SectionWrapper from "../shared/SectionWrapper";
import Navbar from "./nav/Navbar";
import Copyright from "../shared/Copyright";
import SocialNav from "../socials/SocialNav";
import Badge from "../shared/Badge";
import { siteConfig } from "@/config/site";
import { MailIcon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative mt-6 overflow-hidden border-t border-primary/15 bg-primary text-background">
      <div
        aria-hidden="true"
        className="absolute -right-20 -top-24 h-64 w-64 rounded-full border border-background/10 bg-background/5 sm:-right-12"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-28 -left-16 h-56 w-56 rounded-full border border-background/10 bg-background/5"
      />

      <SectionWrapper className="relative py-10 sm:py-12 lg:py-14">
        <div className="grid gap-10 border-b border-background/20 pb-8 sm:pb-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,0.8fr)]">
          <div className="flex max-w-sm flex-col items-center text-center md:items-start md:text-left">
            <Badge />
            <p className="mt-4 text-body-base leading-relaxed text-background/75">
              Thoughtfully processed peanuts, made for the everyday moments worth savouring.
            </p>
            <a
              href={siteConfig.contact.email.link}
              className="mt-5 text-body-sm font-semibold text-background underline decoration-background/40 underline-offset-4 flex items-center gap-2 transition hover:decoration-background"
            >
              <MailIcon className="size-5" />
              {siteConfig.contact.email.label}
            </a>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <p className="font-secondary text-heading-xs font-semibold text-background">Explore</p>
            <div className="mt-3 [&_nav_ul]:flex-col [&_nav_ul]:items-center [&_nav_ul]:divide-x-0 [&_nav_ul]:gap-0 [&_nav_ul]:md:items-start [&_nav_a]:px-0 [&_nav_a]:py-1 [&_nav_a]:text-background/80 [&_nav_a]:transition [&_nav_a]:hover:scale-100 [&_nav_a]:hover:text-background">
              <Navbar />
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <p className="font-secondary text-heading-xs font-semibold text-background">Stay connected</p>
            <p className="mt-3 text-center text-body-sm leading-relaxed text-background/75 md:text-left">
              Follow along for recipes, news, and peanut goodness.
            </p>
            <div className="mt-3 rounded-full border border-background/20 bg-background px-3 py-0.5">
              <SocialNav />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 pt-6 text-center [&_small]:text-background/65 sm:flex-row sm:text-left">
          <Copyright />
          <a
            href={siteConfig.contact.phone.link}
            className="text-body-sm text-background/75 transition hover:text-background"
          >
            {siteConfig.contact.phone.label}
          </a>
        </div>
      </SectionWrapper>
    </footer>
  );
}
