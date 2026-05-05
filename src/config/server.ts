import { serverEnv } from "./env/serverEnv";

export const serverConfig = {
  app: {
    env: serverEnv.NODE_ENV,
    sentryDsn: serverEnv.SENTRY_DSN,
  },
  keys: {
    emailAPi: serverEnv.EMAIL_API_KEY,
    resendApi: serverEnv.RESEND_API_KEY,
    sentryAuthToken: serverEnv.SENTRY_AUTH_TOKEN,
  },
};
