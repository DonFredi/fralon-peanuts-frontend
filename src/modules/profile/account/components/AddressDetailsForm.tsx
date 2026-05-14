import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { H4 } from "@/shared/components/ui/Typography";

export default function AddressDetailsForm() {
  return (
    <form className="max-w-150 mx-0">
      <FieldSet className="gap-6">
        <div className="">
          <FieldLegend className="">
            <H4>Delivery Address Infomation</H4>
          </FieldLegend>
          <FieldDescription>Update your delivery address info.</FieldDescription>
        </div>
        {/* <Activity mode={error ? "visible" : "hidden"}>
                <FormError>{getErrorMessage(error)}</FormError>
              </Activity> */}

        <FieldGroup className="gap-4 grid grid-cols-1 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="constituency">Sub County / Constituency</FieldLabel>
            <Input
              id="constituency"
              type="text"
              placeholder="Embakasi West"
              /* {...register("email", { required: true })} */
            />
            {/* {errors.email && <FieldError>{errors.email.message}</FieldError>} */}
          </Field>

          <Field>
            <FieldLabel htmlFor="ward">Ward</FieldLabel>
            <Input
              id="ward"
              type="text"
              placeholder="Kariobangi South"
              /*  {...register("password", { required: true })} */
            />
            {/* {errors.password && <FieldError>{errors.password.message}</FieldError>} */}
          </Field>

          <Field className="sm:col-span-2">
            <FieldLabel htmlFor="area">Area / Street</FieldLabel>
            <Input
              id="area"
              type="text"
              placeholder="Obama Estate"
              /* {...register("email", { required: true })} */
            />
            {/* {errors.email && <FieldError>{errors.email.message}</FieldError>} */}
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
