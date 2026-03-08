import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD6BuNfVLIbRp___0T6zdHYmR2U0g0EbAU",
  authDomain: "track-532b1.firebaseapp.com",
  projectId: "track-532b1",
  storageBucket: "track-532b1.firebasestorage.app",
  messagingSenderId: "1062315551743",
  appId: "1:1062315551743:web:6e2b4037b8c88f602395ca"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
