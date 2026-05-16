import z from "zod";

export const personalDetailsSchema = z.object({
  username: z.string().min(3, "Username must be 3 or more characters").max(50, "Username is too long"),
  email: z.email("Please enter a valid email").trim().lowercase(),
  phone: z.string("id field has to be a string").min(10, "Invalid phone number").max(15, "Invalid phone number"),
});

export type PersonalDetailsInput = z.infer<typeof personalDetailsSchema>;
