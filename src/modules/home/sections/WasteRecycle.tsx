import SectionWrapper from "@/shared/components/shared/SectionWrapper";
import { H3, P } from "@/shared/components/ui/Typography";
import RecycleIcon from "../icons/RecycleIcon";
import SectionCaption from "@/shared/components/shared/SectionCaption";

export default function WasteRecycle() {
  return (
    <SectionWrapper className="py-8 sm:py-12 lg:py-16">
      <section className="relative overflow-hidden rounded-rad-2xl bg-primary px-5 py-8 text-background shadow-[0_20px_55px_rgba(36,90,70,0.18)] sm:px-8 sm:py-10 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14 lg:px-14 lg:py-14">
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-16 h-52 w-52 rounded-full border border-background/15 bg-background/5 sm:-right-8 sm:-top-12"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-24 -left-16 h-52 w-52 rounded-full border border-background/10 bg-background/5"
        />

        <div className="relative flex flex-col items-start">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background shadow-lg shadow-black/10 sm:h-20 sm:w-20">
            <RecycleIcon />
          </div>
          <SectionCaption className="mt-7 text-background/70">Better by nature</SectionCaption>
          <H3 className="mt-3 max-w-135 text-heading-base leading-tight text-background sm:text-heading-lg">
            Our zero-waste promise gives every peanut a second life.
          </H3>
          <P className="mt-4 max-w-130 text-body-base leading-relaxed text-background/80 sm:text-body-lg">
            We collect, sort, and repurpose peanut skins, shells, and processing leftovers—turning what is left into
            something useful.
          </P>
        </div>

        <div className="relative mt-8 grid gap-3 sm:grid-cols-3 lg:mt-0 lg:grid-cols-1 lg:gap-4">
          <article className="rounded-rad-lg border border-background/15 bg-background/10 p-4 backdrop-blur-sm sm:p-5">
            <p className="text-body-sm font-bold uppercase tracking-[0.12em] text-background/65">01</p>
            <h4 className="mt-2 text-heading-xs text-background">Collected</h4>
            <P className="mt-1.5 text-body-sm leading-relaxed text-background/75">Shells, skins, and by-products are kept out of the waste stream.</P>
          </article>
          <article className="rounded-rad-lg border border-background/15 bg-background/10 p-4 backdrop-blur-sm sm:p-5">
            <p className="text-body-sm font-bold uppercase tracking-[0.12em] text-background/65">02</p>
            <h4 className="mt-2 text-heading-xs text-background">Repurposed</h4>
            <P className="mt-1.5 text-body-sm leading-relaxed text-background/75">Useful materials become animal feed, organic additives, and more.</P>
          </article>
          <article className="rounded-rad-lg border border-background/15 bg-background/10 p-4 backdrop-blur-sm sm:p-5">
            <p className="text-body-sm font-bold uppercase tracking-[0.12em] text-background/65">03</p>
            <h4 className="mt-2 text-heading-xs text-background">Valued</h4>
            <P className="mt-1.5 text-body-sm leading-relaxed text-background/75">A more thoughtful process for people, products, and the planet.</P>
          </article>
        </div>
      </section>
    </SectionWrapper>
  );
}
