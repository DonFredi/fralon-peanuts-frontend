import PageHeading from "@/shared/components/shared/PageHeading";
import PageWrapper from "@/shared/components/shared/PageWrapper";
import SectionWrapper from "@/shared/components/shared/SectionWrapper";
import Support from "./sections/Support";
import Help from "./sections/Help";
import ReportBug from "./sections/ReportBug";

export default function HelpAndSupportPage() {
  return (
    <PageWrapper>
      <SectionWrapper>
        <PageHeading>Help & Support</PageHeading>
      </SectionWrapper>
      <ReportBug />
      <Support />
      <Help />
    </PageWrapper>
  );
}
