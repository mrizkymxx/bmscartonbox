import { z } from 'zod';
import { fallbackConfig } from './fallback-config';

// Environment variables schema for validation
const envSchema = z.object({
  // Firebase
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1, 'Firebase API key is required'),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1, 'Firebase auth domain is required'),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1, 'Firebase project ID is required'),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1, 'Firebase storage bucket is required'),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1, 'Firebase messaging sender ID is required'),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1, 'Firebase app ID is required'),
  
  // Vercel Blob
  BLOB_READ_WRITE_TOKEN: z.string().min(1, 'Blob read/write token is required'),
  
  // App
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

// Check if all required environment variables are present
const hasAllEnvVars = !!(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET &&
  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID &&
  process.env.NEXT_PUBLIC_FIREBASE_APP_ID &&
  process.env.BLOB_READ_WRITE_TOKEN
);

console.log('🔍 Environment Variables Status:');
console.log('Has all env vars:', hasAllEnvVars);
console.log('Using fallback config:', !hasAllEnvVars);

let config;

if (hasAllEnvVars) {
  // Use environment variables
  console.log('✅ Using environment variables');
  const env = envSchema.parse(process.env);
  
  config = {
    firebase: {
      apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
    },
    blob: {
      readWriteToken: env.BLOB_READ_WRITE_TOKEN,
    },
    app: {
      env: env.NODE_ENV,
      url: env.NEXT_PUBLIC_APP_URL,
    },
  };
} else {
  // Use fallback configuration
  console.log('⚠️ Using fallback configuration (env vars not found)');
  config = fallbackConfig;
}

export { config };