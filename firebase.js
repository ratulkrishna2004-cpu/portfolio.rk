import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// 🔴 IMPORTANT: Replace these with YOUR Firebase project config
// Go to: Firebase Console → Project Settings → Your Apps → Firebase SDK snippet
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
