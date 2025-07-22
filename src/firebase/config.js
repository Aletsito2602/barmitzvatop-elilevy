// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGAWjxklBYKmax2xlX-bSJ5jz26rmYMRY",
  authDomain: "barmitzva-top.firebaseapp.com",
  projectId: "barmitzva-top",
  storageBucket: "barmitzva-top.firebasestorage.app",
  messagingSenderId: "384610320474",
  appId: "1:384610320474:web:3c1730cd773e39471f5863"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Storage and get a reference to the service
export const storage = getStorage(app);

export default app;