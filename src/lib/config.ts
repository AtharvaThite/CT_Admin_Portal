export const appConfig = {
  env: process.env.NEXT_PUBLIC_APP_ENV as 'dev' | 'staging' | 'prod',
  isDev: process.env.NEXT_PUBLIC_APP_ENV === 'dev',
  isStaging: process.env.NEXT_PUBLIC_APP_ENV === 'staging',
  isProd: process.env.NEXT_PUBLIC_APP_ENV === 'prod',
  appUrl: process.env.NEXT_PUBLIC_APP_URL!,
  enableLogging: process.env.NEXT_PUBLIC_APP_ENV !== 'prod',
} as const;
