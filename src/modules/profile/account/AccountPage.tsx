import PageHeading from "@/shared/components/shared/PageHeading";
import PageWrapper from "@/shared/components/shared/PageWrapper";
import SectionWrapper from "@/shared/components/shared/SectionWrapper";
import { H5, P } from "@/shared/components/ui/Typography";
import { Award } from "lucide-react";
import PersonalDetailsForm from "./components/PersonalDetailsForm";
import AddressDetailsForm from "./components/AddressDetailsForm";
import { Button } from "@/shared/components/ui/button";

export default function AccountPage() {
  return (
    <PageWrapper>
      <SectionWrapper>
        <PageHeading>Account info.</PageHeading>
      </SectionWrapper>
      <SectionWrapper>
        <div className="flex flex-col gap-6 max-w-217.5">
          <div className="border border-foreground-border radius-card p-4 gap-4 sm:p-6 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary" />
              <div className="">
                <H5>Nutty junky</H5>
                <small className="text-foreground-caption text-caption-base">#66s77giha97rhsaaf</small>
              </div>
            </div>
            <span className="flex items-center gap-2">
              <Award />
              <P>Silver</P>
            </span>
          </div>

          <div className="border border-foreground-border radius-card p-4 sm:p-6 flex flex-col gap-4">
            <PersonalDetailsForm />
          </div>

          <div className="border border-foreground-border radius-card p-4 sm:p-6 flex flex-col gap-4">
            <AddressDetailsForm />
          </div>
          <Button>Save changes</Button>
        </div>
      </SectionWrapper>
    </PageWrapper>
  );
}
