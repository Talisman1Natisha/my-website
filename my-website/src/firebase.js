import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Firebase configuration object - make sure this is correct
const firebaseConfig = {
  apiKey: "AIzaSyAmhIHbZGWfMk13pTwv5wpvRqKx4VaJgos",
  authDomain: "talisman-series.firebaseapp.com",
  projectId: "talisman-series",
  storageBucket: "talisman-series.appspot.com",
  messagingSenderId: "742011375995",
  appId: "1:742011375995:web:fb9ab273664e2dbd016dde"
};

// Initialize Firebase 
console.log("Initializing Firebase with project:", firebaseConfig.projectId);
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

console.log("Firebase services initialized");

export { db, auth, storage };
