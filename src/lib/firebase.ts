import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAhBV_ZqYb-5V2yyVgSTXoBHtSl4tmoz5c",
  authDomain: "skillsprint-pankaj.firebaseapp.com",
  projectId: "skillsprint-pankaj",
  storageBucket: "skillsprint-pankaj.firebasestorage.app",
  messagingSenderId: "371626915871",
  appId: "1:371626915871:web:6c71d7488037451006fd2a",
  measurementId: "G-H66M9BXQDV"
};

// Initialize Firebase app only if it doesn't already exist
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();