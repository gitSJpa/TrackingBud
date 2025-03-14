import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDThq9q1IaOd8tqPenK419QcKcJpqA7orA",
  authDomain: "trackingbud-fcad4.firebaseapp.com",
  projectId: "trackingbud-fcad4",
  storageBucket: "trackingbud-fcad4.firebasestorage.app",
  messagingSenderId: "225152083975",
  appId: "1:225152083975:web:3f6574572743176b3c22a2",
  measurementId: "G-SEHKY9EWZ8",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);

export { app, auth, db };
