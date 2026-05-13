import PageHeading from "@/shared/components/shared/PageHeading";
import PageWrapper from "@/shared/components/shared/PageWrapper";
import SectionWrapper from "@/shared/components/shared/SectionWrapper";
import NotificationsSection from "./sections/NotificationsSection";

export default function NotificationsPage() {
  return (
    <PageWrapper>
      <SectionWrapper>
        <PageHeading>Notifications</PageHeading>
      </SectionWrapper>
      <NotificationsSection />
    </PageWrapper>
  );
}
