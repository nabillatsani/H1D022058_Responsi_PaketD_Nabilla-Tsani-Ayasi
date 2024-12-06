// src/utils/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBQhx4MFjUB8P49jVyNDmHoz0K_EI3tuUY",
    authDomain: "responsi-3de90.firebaseapp.com",
    projectId: "responsi-3de90",
    storageBucket: "responsi-3de90.firebasestorage.app",
    messagingSenderId: "394263131560",
    appId: "1:394263131560:web:7e9f58caed42349170d99d",
    measurementId: "G-WXKJNX0HLZ"
  };

const firebase = initializeApp(firebaseConfig);
const db = getFirestore(firebase);
const auth = getAuth(firebase);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, db };