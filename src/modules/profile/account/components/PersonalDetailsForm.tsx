"use client";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { H4 } from "@/shared/components/ui/Typography";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { personalDetailsSchema, type PersonalDetailsInput } from "../schemas/personal-details.schema";
import { Activity, useEffect, useState } from "react";
import FormError from "@/shared/components/shared/FormError";
import { getErrorMessage } from "@/shared/utils/get-error-message";
import { Button } from "@/shared/components/ui/button";
import { Pencil, Save } from "lucide-react";

export default function PersonalDetailsForm({ user }: { user: User | undefined }) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<PersonalDetailsInput>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset(user);
    }
  }, [reset, user]);

  const handleUpdatePersonalDetails: SubmitHandler<PersonalDetailsInput> = async (data) => {
    try {
      /*  await mutateAsync(data); */
      reset();
    } catch (err) {
      console.log("Login error :", getErrorMessage(err));
    }
  };
  return (
    <form onSubmit={handleSubmit(handleUpdatePersonalDetails)} className="max-w-150 mx-0">
      <FieldSet className="gap-6">
        <div className="flex items-center gap-4 justify-between">
          <div className="">
            <FieldLegend className="">
              <H4>Personal Infomation</H4>
            </FieldLegend>
            <FieldDescription>Update your personal info.</FieldDescription>
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
          <Field className="sm:col-span-2">
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <Input disabled={!isEditing} id="username" type="text" {...register("username")} />
            {errors.username && <FieldError>{errors.username.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input disabled={!isEditing} id="email" type="email" {...register("email")} />
            {errors.email && <FieldError>{errors.email.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="phone">Phone</FieldLabel>
            <Input disabled={!isEditing} id="phone" type="tel" {...register("phone")} />
            {errors.phone && <FieldError>{errors.phone.message}</FieldError>}
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
