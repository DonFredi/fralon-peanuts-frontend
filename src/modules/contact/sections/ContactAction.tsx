import { siteConfig } from "@/config/site";
import SectionWrapper from "@/shared/components/shared/SectionWrapper";
import ContactActionCard from "../components/ContactActionCard";
import PhoneIcon from "../icons/PhoneIcon";
import WhatsappIcon from "../icons/WhatsappIcon";
import EmailIcon from "../icons/EmailIcon";

export default function ContactAction() {
  const actions = siteConfig.contact;
  return (
    <SectionWrapper>
      <div className="max-w-115 md:max-w-full grid mx-auto grid-cols-1 md:grid-cols-3 gap-4 place-items-center">
        <ContactActionCard href={actions.phone.link} icon={PhoneIcon} title="Phone">
          {actions.phone.label}
        </ContactActionCard>
        <ContactActionCard active href={actions.email.link} icon={EmailIcon} title="Email">
          {actions.email.label}
        </ContactActionCard>
        <ContactActionCard href={actions.whatsapp.link} icon={WhatsappIcon} title="Whatsapp">
          {actions.whatsapp.label}
        </ContactActionCard>
      </div>
    </SectionWrapper>
  );
}
