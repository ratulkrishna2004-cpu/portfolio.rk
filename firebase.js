import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// 🔴 IMPORTANT: Replace these with YOUR Firebase project config
// Go to: Firebase Console → Project Settings → Your Apps → Firebase SDK snippet
const firebaseConfig = {
  apiKey: "AIzaSyAGBsipDr6skfsvDrYHHCe7CK9AWcCt-dA",
  authDomain: "portfolio-rk-41348.firebaseapp.com",
  databaseURL: "https://portfolio-rk-41348-default-rtdb.firebaseio.com",
  projectId: "portfolio-rk-41348",
  storageBucket: "portfolio-rk-41348.firebasestorage.app",
  messagingSenderId: "1012347569431",
  appId: "1:1012347569431:web:75d9d60efc9513ac63e352",
  measurementId: "G-EXC67LS81T"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
