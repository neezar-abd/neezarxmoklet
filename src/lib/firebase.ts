import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
// Optional: App Check for bot protection
// import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase app (singleton pattern)
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Debug: Log Firebase config (remove in production)
if (typeof window !== "undefined") {
  console.log("Firebase Config:", {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    hasApiKey: !!firebaseConfig.apiKey
  });
}

// Optional: Enable App Check for bot protection
// if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
//   initializeAppCheck(app, {
//     provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY),
//     isTokenAutoRefreshEnabled: true,
//   });
// }

export default app;
