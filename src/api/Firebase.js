// Import Firestore from Firebase SDK
import { getFirestore } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCwJSWXrGuK25Z60TXOm_YCLkd0OvwMr1I",
  authDomain: "dynamic-portfolio-e0573.firebaseapp.com",
  projectId: "dynamic-portfolio-e0573",
  storageBucket: "dynamic-portfolio-e0573.firebasestorage.app",
  messagingSenderId: "12124305731",
  appId: "1:12124305731:web:b070062b71b994b28617f6",
  measurementId: "G-ZESMJDHLSW"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Initialize Firestore

export default db;  // Export Firestore instance
