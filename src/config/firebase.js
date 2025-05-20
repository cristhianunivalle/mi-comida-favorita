// Import the functions you need from the SDKs you need
import '@expo/metro-runtime';
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDX1C3YCJUGZS6xV4Jbo_GIXRE1cP9lGx8",
  authDomain: "micomidafavorita-7a6d3.firebaseapp.com",
  projectId: "micomidafavorita-7a6d3",
  storageBucket: "micomidafavorita-7a6d3.firebasestorage.app",
  messagingSenderId: "960644148306",
  appId: "1:960644148306:web:44db8f9c41596d1a4e438b",
  measurementId: "G-82MXQG2MDY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);