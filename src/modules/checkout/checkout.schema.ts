import z from "zod";

// matches 07xxxxxxxx, 01xxxxxxxx, 254xxxxxxxxx, +254xxxxxxxxx
const kenyanPhoneRegex = /^(?:254|\+254|0)(7[0-9]{8}|1[0-9]{8})$/;

export const checkoutSchema = z
  .object({
    fulfillment_method: z.enum(["pickup", "delivery"], { message: "Please select an option" }),
    constituency: z.string().optional(),
    ward: z.string().optional(),
    street: z.string().optional(),
    payment_method: z.enum(["cash", "mpesa"], { message: "Please select a payment option" }),
    mpesa_phone: z
      .string()
      .regex(kenyanPhoneRegex, "Enter a valid Kenyan M-Pesa number e.g. 0712345678")
      .optional()
      .or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    // delivery address fields required when fulfillment is delivery
    if (data.fulfillment_method === "delivery") {
      if (!data.constituency) {
        ctx.addIssue({
          code: "custom",
          path: ["constituency"],
          message: "Please select your constituency",
        });
      }
      if (!data.ward) {
        ctx.addIssue({
          code: "custom",
          path: ["ward"],
          message: "Please select your ward",
        });
      }
      if (!data.street) {
        ctx.addIssue({
          code: "custom",
          path: ["street"],
          message: "Please describe your street or area",
        });
      }
    }

    // mpesa phone required when payment method is mpesa
    if (data.payment_method === "mpesa" && !data.mpesa_phone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["mpesa_phone"],
        message: "Please enter your M-Pesa phone number",
      });
    }
  });

export type CheckoutInput = z.infer<typeof checkoutSchema>;
