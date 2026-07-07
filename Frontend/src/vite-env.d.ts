/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_RECAPTCHA_SITE_KEY?: string;
  readonly VITE_ENCRYPTION_SECRET: string;
  readonly VITE_DEMO_OTP?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
