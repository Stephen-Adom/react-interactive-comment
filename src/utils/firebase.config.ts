// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKLk_GrddncmyjNwS2ZZ316zQ0EvtUjjU",
  authDomain: "interactive-comments-82b11.firebaseapp.com",
  projectId: "interactive-comments-82b11",
  storageBucket: "interactive-comments-82b11.appspot.com",
  messagingSenderId: "957005341888",
  appId: "1:957005341888:web:42ce2af5cdcd04359ff925",
  measurementId: "G-NV9T4Z7H22",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
