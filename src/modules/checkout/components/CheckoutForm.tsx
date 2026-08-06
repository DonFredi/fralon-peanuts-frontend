"use client";
import SectionWrapper from "@/shared/components/shared/SectionWrapper";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/shared/components/ui/field";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { checkoutSchema, type CheckoutInput } from "../checkout.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { H3 } from "@/shared/components/ui/Typography";
import { Input } from "@/shared/components/ui/input";
import CheckoutOrderSummary from "@/modules/cart/components/CheckoutOrderSummary";
import { DELIVERY_FEE_KSH } from "../checkout.api";
import { useCreateOrder } from "../use-create-order";
import { useCart } from "@/modules/cart/context/cart-context";
import { Button } from "@/shared/components/ui/button";
import RadioBtnWrapper from "./RadioBtnWrapper";
import { Activity } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, isLoading: isCartLoading } = useCart();
  const createOrderMutation = useCreateOrder();
  const { handleSubmit, control, watch } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fulfillment_method: undefined,
      constituency: "",
      ward: "",
      street: "",
      payment_method: undefined,
      mpesa_phone: "",
    },
  });

  const fulfillmentMethodSelection = watch("fulfillment_method");
  const paymentMethodSelection = watch("payment_method");
  const deliveryFee = fulfillmentMethodSelection === "delivery" ? DELIVERY_FEE_KSH : 0;

  const handleCheckout: SubmitHandler<CheckoutInput> = async (data) => {
    if (isCartLoading || items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      const order = await createOrderMutation.mutateAsync(data);
      console.log("Order data::", order);
      router.push(`/checkout/success?orderId=${order.order_id}`);
    } catch (error) {
      toast.error("We could not place your order. Please review your cart and try again.");
    }
  };

  return (
    <SectionWrapper>
      <form onSubmit={handleSubmit(handleCheckout)} className="max-w-198 flex flex-col gap-8">
        <FieldSet className="border border-foreground-border radius-card p-6">
          <div className="flex gap-4 flex-col">
            <H3 className="py-0">Choose your prefered option</H3>
            <FieldGroup>
              <Controller
                name="fulfillment_method"
                control={control}
                render={({ field, fieldState }) => (
                  <div className="space-y-2">
                    <RadioGroup
                      data-invalid={fieldState.invalid}
                      aria-invalid={fieldState.invalid}
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                      className="grid gap-4 grid-cols-1 sm:grid-cols-2"
                    >
                      <RadioBtnWrapper htmlFor="pickup" active={fulfillmentMethodSelection === "pickup"}>
                        <RadioGroupItem value="pickup" id="pickup" />
                        <span>Pickup</span>
                      </RadioBtnWrapper>
                      <RadioBtnWrapper htmlFor="delivery" active={fulfillmentMethodSelection === "delivery"}>
                        <RadioGroupItem value="delivery" id="delivery" />
                        <span>Delivery</span>
                      </RadioBtnWrapper>
                    </RadioGroup>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </div>
                )}
              />
            </FieldGroup>
          </div>
          <Activity mode={fulfillmentMethodSelection === "delivery" ? "visible" : "hidden"}>
            <div className="flex gap-4 flex-col">
              <H3 className="py-0">Delivery address</H3>
              <FieldGroup className="grid gap-y-2 gap-x-3 grid-cols-1 md:grid-cols-2">
                <Controller
                  name="constituency"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Constituency / Sub County</FieldLabel>
                      <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger aria-invalid={fieldState.invalid}>
                          <SelectValue placeholder="Select your constituency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kasarani">Kasarani</SelectItem>
                          <SelectItem value="starehe">Starehe</SelectItem>
                          <SelectItem value="embakasiWest">Embakasi West</SelectItem>
                          <SelectItem value="dagoretti">Dagoretti</SelectItem>
                          <SelectItem value="westlands">Westlands</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
                <Controller
                  name="ward"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Ward</FieldLabel>
                      <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger aria-invalid={fieldState.invalid}>
                          <SelectValue placeholder="Select your ward" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="njiru">Njiru</SelectItem>
                          <SelectItem value="dandora">Dandora</SelectItem>
                          <SelectItem value="mathare">Mathare</SelectItem>
                          <SelectItem value="kibra">Kibra</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
                <Controller
                  name="street"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="md:col-span-2">
                      <FieldLabel htmlFor="street">Area / Street</FieldLabel>
                      <Textarea
                        {...field}
                        id="street"
                        aria-invalid={fieldState.invalid}
                        placeholder="Describe your area"
                        className="min-h-14"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </FieldGroup>
            </div>
          </Activity>
        </FieldSet>

        <FieldSet className="border border-foreground-border radius-card p-6">
          <div className="flex gap-4 flex-col">
            <H3 className="py-0">Choose payment option</H3>
            <FieldGroup>
              <Controller
                name="payment_method"
                control={control}
                render={({ field, fieldState }) => (
                  <div className="space-y-2">
                    <RadioGroup
                      data-invalid={fieldState.invalid}
                      aria-invalid={fieldState.invalid}
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                      className="grid gap-4 grid-cols-1 sm:grid-cols-2"
                    >
                      <RadioBtnWrapper htmlFor="cash" active={paymentMethodSelection === "cash"}>
                        <RadioGroupItem value="cash" id="cash" />
                        <span>Cash on Delivery</span>
                      </RadioBtnWrapper>
                      <RadioBtnWrapper htmlFor="mpesa" active={paymentMethodSelection === "mpesa"}>
                        <RadioGroupItem value="mpesa" id="mpesa" />
                        <span>Mpesa</span>
                      </RadioBtnWrapper>
                    </RadioGroup>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </div>
                )}
              />
            </FieldGroup>
          </div>

          <Activity mode={paymentMethodSelection === "mpesa" ? "visible" : "hidden"}>
            <div className="flex gap-4 flex-col">
              <H3 className="py-0">Pay easily with mpesa</H3>
              <FieldGroup>
                <Controller
                  name="mpesa_phone"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="mpesa_phone">Enter Mpesa Phone Number</FieldLabel>
                      <Input
                        {...field}
                        id="mpesa_phone"
                        type="tel"
                        aria-invalid={fieldState.invalid}
                        placeholder="07xxxxxxxx"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      <FieldDescription>You'll receive a payment prompt on your phone</FieldDescription>
                    </Field>
                  )}
                />
              </FieldGroup>
            </div>
          </Activity>
        </FieldSet>
        <CheckoutOrderSummary deliveryFee={deliveryFee} subTotal={subtotal} />
        <Button
          type="submit"
          disabled={createOrderMutation.isPending || isCartLoading || items.length === 0}
          className="w-full sticky bottom-3 sm:hidden -mt-4"
        >
          Confirm Order
        </Button>
      </form>
    </SectionWrapper>
  );
}
