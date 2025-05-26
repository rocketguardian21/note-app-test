import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA8iJveSy6XTGiZey4Mu1264XoOev336_g",
  authDomain: "notes-test-e904f.firebaseapp.com",
  projectId: "notes-test-e904f",
  storageBucket: "notes-test-e904f.firebasestorage.app",
  messagingSenderId: "945334086763",
  appId: "1:945334086763:web:13a3bf84f656393bfb952e",
  measurementId: "G-Y5S3Q5W453"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics
const analytics = getAnalytics(app);

// Get Auth instance
export const auth = getAuth(app);

// Get Firestore instance
export const db = getFirestore(app);

export default app; 