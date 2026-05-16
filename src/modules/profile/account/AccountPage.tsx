"use client";
import PageHeading from "@/shared/components/shared/PageHeading";
import PageWrapper from "@/shared/components/shared/PageWrapper";
import SectionWrapper from "@/shared/components/shared/SectionWrapper";
import { LogOut } from "lucide-react";
import PersonalDetailsForm from "./components/PersonalDetailsForm";
import AddressDetailsForm from "./components/AddressDetailsForm";
import LogoutButton from "@/modules/auth/logout/components/LogoutButton";
import { useMe } from "./me/useMe";
import AccountInfo from "./components/AccountInfo";

export default function AccountPage() {
  const { data: user, isFetching } = useMe();

  return (
    <PageWrapper>
      <SectionWrapper>
        <PageHeading>Account info.</PageHeading>
      </SectionWrapper>
      <SectionWrapper>
        <div className="flex flex-col gap-6 max-w-217.5">
          <AccountInfo user={user} />

          <div className="border border-foreground-border radius-card p-4 sm:p-6 flex flex-col gap-4">
            <PersonalDetailsForm user={user} />
          </div>

          <div className="border border-foreground-border radius-card p-4 sm:p-6 flex flex-col gap-4">
            <AddressDetailsForm />
          </div>
          <div className="self-end">
            <LogoutButton>
              <LogOut className="size-5" /> Log out
            </LogoutButton>
          </div>
        </div>
      </SectionWrapper>
    </PageWrapper>
  );
}
