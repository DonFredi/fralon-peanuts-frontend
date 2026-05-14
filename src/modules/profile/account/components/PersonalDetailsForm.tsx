import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { H4 } from "@/shared/components/ui/Typography";

export default function PersonalDetailsForm() {
  return (
    <form className="max-w-150 mx-0">
      <FieldSet className="gap-6">
        <div className="">
          <FieldLegend className="">
            <H4>Personal Infomation</H4>
          </FieldLegend>
          <FieldDescription>Update your personal info.</FieldDescription>
        </div>
        {/* <Activity mode={error ? "visible" : "hidden"}>
                <FormError>{getErrorMessage(error)}</FormError>
              </Activity> */}
        <FieldGroup className="gap-4 grid grid-cols-1 sm:grid-cols-2">
          <Field className="sm:col-span-2">
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <Input
              id="username"
              type="text"
              placeholder="Nutty Junky"
              /* {...register("email", { required: true })} */
            />
            {/* {errors.email && <FieldError>{errors.email.message}</FieldError>} */}
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="nuttyjunky@example.com"
              /* {...register("email", { required: true })} */
            />
            {/* {errors.email && <FieldError>{errors.email.message}</FieldError>} */}
          </Field>

          <Field>
            <FieldLabel htmlFor="phone">Phone</FieldLabel>
            <Input
              id="phone"
              type="tel"
              placeholder="+254 799 000 000"
              /*  {...register("password", { required: true })} */
            />
            {/* {errors.password && <FieldError>{errors.password.message}</FieldError>} */}
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
