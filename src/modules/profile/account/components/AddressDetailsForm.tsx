"use client";
import { Button } from "@/shared/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { H4 } from "@/shared/components/ui/Typography";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Save } from "lucide-react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { addressDetailsSchema, type AddressDetailsInput } from "../schemas/address-details.schema";
import { getErrorMessage } from "@/shared/utils/get-error-message";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

export default function AddressDetailsForm() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<AddressDetailsInput>({
    resolver: zodResolver(addressDetailsSchema),
  });

  const handleUpdatePersonalDetails: SubmitHandler<AddressDetailsInput> = async (data) => {
    try {
      /*  await mutateAsync(data); */
      reset();
    } catch (err) {
      console.log("Login error :", getErrorMessage(err));
    }
  };
  return (
    <form className="max-w-150 mx-0">
      <FieldSet className="gap-6">
        <div className="flex items-center gap-4 justify-between">
          <div className="">
            <FieldLegend className="">
              <H4>Delivery Address Infomation</H4>
            </FieldLegend>
            <FieldDescription>Update your delivery address info.</FieldDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setIsEditing(!isEditing)} size="sm" variant="ghost">
              <Pencil />
              Edit
            </Button>
            <Button disabled={!isDirty} size="sm">
              <Save />
              Save
            </Button>
          </div>
        </div>
        {/* <Activity mode={error ? "visible" : "hidden"}>
                <FormError>{getErrorMessage(error)}</FormError>
              </Activity> */}

        <FieldGroup className="gap-4 grid grid-cols-1 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="constituency">Sub County / Constituency</FieldLabel>
            <Select disabled={!isEditing}>
              <SelectTrigger>
                <SelectValue placeholder="Choose your Constituency" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Njiru">Embakasi</SelectItem>
                  <SelectItem value="Kasarani">Kasarani</SelectItem>
                  <SelectItem value="Kamkunji">Kamkunji</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="ward">Ward</FieldLabel>
            <Select disabled={!isEditing}>
              <SelectTrigger>
                <SelectValue placeholder="Choose your Ward" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Njiru">Engineering</SelectItem>
                  <SelectItem value="Kasarani">Design</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <Field className="sm:col-span-2">
            <FieldLabel htmlFor="area">Area / Street</FieldLabel>
            <Input
              disabled={!isEditing}
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
