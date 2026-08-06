"use client";
import { Button } from "@/shared/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/shared/components/ui/field";
import { H4 } from "@/shared/components/ui/Typography";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Save } from "lucide-react";
import { Activity, useEffect, useState } from "react";
import { Controller, useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { addressDetailsSchema, type AddressDetailsInput } from "../schemas/address-details.schema";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { ProfileWithAddresses } from "../me/update-profile/update-profile.types";
import { Textarea } from "@/shared/components/ui/textarea";
import { nairobiLocations } from "../content/delivery-locations";
import { useUpdateAddress } from "../me/update-address/useUpdateAddress";
import { useCreateAddress } from "../me/create-address/useCreateAddress";
import FormError from "@/shared/components/shared/FormError";

type Constituency = keyof typeof nairobiLocations;

export default function AddressDetailsForm({ user }: { user: ProfileWithAddresses | null }) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { mutateAsync, isPending } = useUpdateAddress();
  const { mutateAsync: createAddress, isPending: isCreating } = useCreateAddress();

  if (!user?.addresses) return <div className="">No address setup yet</div>;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty, dirtyFields },
  } = useForm<AddressDetailsInput>({
    resolver: zodResolver(addressDetailsSchema),
    defaultValues: {
      constituency: user?.addresses[0]?.constituency ?? "",
      ward: user?.addresses[0]?.ward ?? "",
      street: user?.addresses[0]?.street ?? "",
    },
  });

  useEffect(() => {
    console.log("reset running repeatedly");
    if (user?.addresses[0]) {
      reset(user.addresses[0]);
    }
  }, [reset, user?.addresses[0]?.id]);

  const constituencies = Object.keys(nairobiLocations);

  const selectedConstituency = useWatch<AddressDetailsInput>({
    name: "constituency",
    control,
  });

  const wards = selectedConstituency && nairobiLocations[selectedConstituency as Constituency];

  const handleUpdateAddressDetails: SubmitHandler<Partial<AddressDetailsInput>> = async (data) => {
    const updates = Object.keys(dirtyFields).reduce((acc, key) => {
      acc[key as keyof AddressDetailsInput] = data[key as keyof AddressDetailsInput];
      return acc;
    }, {} as Partial<AddressDetailsInput>);

    try {
      const newAddresses = await mutateAsync(updates);
      reset(newAddresses);
      setIsEditing(false);
    } catch (err) {
      console.log("updating error :", err);
    }
  };

  const handleCreateAddress: SubmitHandler<AddressDetailsInput> = async (data) => {
    try {
      const newAddresses = await createAddress(data);
      reset(newAddresses);
      setIsEditing(false);
    } catch (err) {
      console.log("creating error :", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(!user?.addresses[0]?.id ? handleCreateAddress : handleUpdateAddressDetails)}
      className="max-w-150 mx-0"
    >
      <FieldSet className="gap-6">
        <div className="flex items-center gap-4 justify-between">
          <div className="">
            <FieldLegend className="">
              <H4>Delivery Address Infomation</H4>
            </FieldLegend>
            <FieldDescription>Update your delivery address info.</FieldDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" onClick={() => setIsEditing(true)} size="sm" variant="ghost">
              <Pencil />
              Edit
            </Button>
            <Button type="submit" disabled={!isDirty} size="sm">
              <Save />
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
        <Activity mode={errors.root ? "visible" : "hidden"}>
          <FormError>{errors.root?.message}</FormError>
        </Activity>
        <FieldGroup className="gap-4 grid grid-cols-1 sm:grid-cols-2">
          <Controller
            name="constituency"
            control={control}
            render={({ field, fieldState }) => {
              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Sub County / Constituency</FieldLabel>
                  <Select
                    disabled={!isEditing}
                    name={field.name}
                    value={field.value}
                    onValueChange={(value) => {
                      console.log("Selected Constituency::", value);
                      field.onChange(value);
                    }}
                  >
                    <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Choose your Constituency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {constituencies.map((constituency) => (
                          <SelectItem key={constituency} value={constituency}>
                            {constituency}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              );
            }}
          />

          <Controller
            name="ward"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="ward">Ward</FieldLabel>
                <Select
                  disabled={!isEditing || !selectedConstituency}
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your Ward" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {wards &&
                        wards.map((ward) => (
                          <SelectItem key={ward} value={ward}>
                            {ward}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Field data-invalid={!!errors.street} className="sm:col-span-2">
            <FieldLabel htmlFor="street">Area / Street</FieldLabel>
            <Textarea
              id="street"
              disabled={!isEditing}
              aria-invalid={!!errors.street}
              placeholder="Describe your area"
              className="min-h-14"
              {...register("street")}
            />
            {errors?.street && <FieldError>{errors.street.message}</FieldError>}
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
