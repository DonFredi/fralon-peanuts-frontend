"use client";
import PageWrapper from "@/shared/components/shared/PageWrapper";
import SectionWrapper from "@/shared/components/shared/SectionWrapper";
import { Button } from "@/shared/components/ui/button";
import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import SectionHeading from "@/shared/components/shared/SectionHeading";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);
  return (
    <PageWrapper>
      <SectionWrapper className="flex flex-col items-center gap-2 justify-start">
        <SectionHeading className="text-destructive font-bold">Error</SectionHeading>
        <p className="">Something has gone wrong, please try again!</p>
        <Button onClick={() => reset()} className="w-fit">
          Try again
        </Button>
      </SectionWrapper>
    </PageWrapper>
  );
}
