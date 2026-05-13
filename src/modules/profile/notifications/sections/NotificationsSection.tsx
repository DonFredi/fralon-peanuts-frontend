import SectionWrapper from "@/shared/components/shared/SectionWrapper";
import NotificationItem from "../components/NotificationItem";

export default function NotificationsSection() {
  return (
    <SectionWrapper>
      <div className="max-w-210 mx-auto">
        {[...Array(16)].map((_, index) => (
          <NotificationItem key={index} />
        ))}
      </div>
    </SectionWrapper>
  );
}
