import { parseEnv } from "util";
import z from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  EMAIL_API_KEY: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  SENTRY_DSN: z.url(),
  SENTRY_AUTH_TOKEN: z.string().min(1),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.log("Invalid Env variables");
  console.log(parsedEnv.error);
  process.exit(1);
}

export const serverEnv = parsedEnv.data;
