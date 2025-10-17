// Temporary fallback Firebase config for development
// Remove this file after environment variables are working

export const fallbackFirebaseConfig = {
  apiKey: "AIzaSyAFUf5AUsT8fvqHYvA_vDVVjBRuVXWsxwA",
  authDomain: "cartonflow-shyw4.firebaseapp.com",
  projectId: "cartonflow-shyw4",
  storageBucket: "cartonflow-shyw4.firebasestorage.app",
  messagingSenderId: "142328250405",
  appId: "1:142328250405:web:1939db7116e40b4cbfbfcc"
};

export const fallbackConfig = {
  firebase: fallbackFirebaseConfig,
  blob: {
    readWriteToken: "vercel_blob_rw_c4uRqdxfNys2kwiQ_RfguC2n9llydpaAaFEn0FJkcl1osEb"
  },
  app: {
    env: "development" as const
  }
};