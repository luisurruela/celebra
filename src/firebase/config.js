import { getFirestore } from "firebase/firestore";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyASSG2DdZb4KiqwVLPih2h6nwuM3cguEnY",
  authDomain: "celebra-app-5958f.firebaseapp.com",
  projectId: "celebra-app-5958f",
  storageBucket: "celebra-app-5958f.firebasestorage.app",
  messagingSenderId: "40186183176",
  appId: "1:40186183176:web:7fb93a140662ab165fdbbd",
  measurementId: "G-WFRZHJGQPD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, app };