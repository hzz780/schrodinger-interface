import * as Sentry from '@sentry/nextjs';
const { NEXT_PUBLIC_APP_ENV } = process.env;

export const init = () =>
  Sentry.init({
    // Should add your own dsn
    dsn: 'https://522323393129898ba13525cd9b5baf71@o4505006413840384.ingest.us.sentry.io/4506896727670784',
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
    environment: process.env.NEXT_PUBLIC_APP_ENV,
    // ...
    // Note: if you want to override the automatic release value, do not set a
    // `release` value here - use the environment variable `SENTRY_RELEASE`, so
    // that it will also get attached to your source maps
    beforeSend(event) {
      if (NEXT_PUBLIC_APP_ENV !== 'production') {
        return null;
      }
      return event;
    },
  });
