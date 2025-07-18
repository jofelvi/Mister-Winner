import { getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyChri3lVZRU2D9zOas_a2_cc5J4NRdLSYo',
  authDomain: 'mister-winner.firebaseapp.com',
  projectId: 'mister-winner',
  storageBucket: 'mister-winner.firebasestorage.app',
  messagingSenderId: '419429221055',
  appId: '1:419429221055:web:19cca534665272f1ac3c0a',
  measurementId: 'G-HR2E0NLEHL',
};
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

export { db, auth, storage };
