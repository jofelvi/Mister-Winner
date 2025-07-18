import { getApps, initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, enableNetwork } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Validate required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
];

const missingEnvVars = requiredEnvVars.filter(
  envVar => !process.env[envVar]
);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required Firebase environment variables: ${missingEnvVars.join(', ')}`
  );
}

let firebaseApp;

if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApps()[0]; // if already initialized, use that one
}

// Initialize Firestore and Auth
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);

// Enable offline persistence for better performance
if (typeof window !== 'undefined') {
  enableNetwork(db).catch((error) => {
    console.warn('Error enabling Firestore network:', error);
  });
}

export { db, auth, storage };
