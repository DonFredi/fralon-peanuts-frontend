import SectionHeading from "@/shared/components/shared/SectionHeading";
import SectionWrapper from "@/shared/components/shared/SectionWrapper";
import { Button } from "@/shared/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLegend, FieldSet } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { P } from "@/shared/components/ui/Typography";

export default function ReportBug() {
  return (
    <SectionWrapper>
      <div className="section-head-start mx-auto items-start">
        <div className="section-head-start">
          <SectionHeading>Report bug</SectionHeading>
          <P>
            If you encounter a bug, app misbehavior, or something not working properly, please let us know. Your
            feedback helps us improve.
          </P>
        </div>
        <form className="mt-2 max-w-125 mx-0">
          <FieldGroup className="">
            <FieldSet>
              <FieldLegend className="sr-only">Report bug</FieldLegend>
              <FieldDescription className="sr-only">Report bugs you encounter to help us get better</FieldDescription>
              <FieldGroup className="flex flex-col gap-4">
                <Field>
                  {/* <FieldLabel htmlFor="username">Username</FieldLabel> */}
                  <Input placeholder="Bug description" id="description" autoComplete="off" />
                </Field>
                <Field>
                  {/* <FieldLabel htmlFor="username">Username</FieldLabel> */}
                  <Textarea id="message" placeholder="Briefly describe the bug you encountered" rows={4} />
                </Field>
              </FieldGroup>
            </FieldSet>
            <Field orientation="horizontal">
              <Button variant="destructive" type="submit" className="ml-auto -mt-2">
                Report Bug
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </SectionWrapper>
  );
}
