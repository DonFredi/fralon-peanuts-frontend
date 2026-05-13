import SectionHeading from "@/shared/components/shared/SectionHeading";
import SectionWrapper from "@/shared/components/shared/SectionWrapper";
import NavButton from "@/shared/components/ui/NavButton";
import { P } from "@/shared/components/ui/Typography";

export default function Support() {
  return (
    <SectionWrapper>
      <div className="section-head-start mx-auto">
        <SectionHeading>Support</SectionHeading>
        <div className="">
          <P>
            For any inquiries about our product and services please get in touch with us through our Email
            fralonpeanuts@gmail.com{" "}
          </P>
          <P>
            You can also get in touch through our help lines +254797000000 or +254735000000 or Whatsapp us through the
            number +254796000000
          </P>
          <P>You can also reach us through our Contact Form by clicking the Contact us button below</P>
        </div>
        <NavButton path="/contact">Contact us</NavButton>
      </div>
    </SectionWrapper>
  );
}
