import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDjf1IRPM0NxdbJ6GEqA38m8im2YNlfwDk",
    authDomain: "my-instagram-93c89.firebaseapp.com",
    projectId: "my-instagram-93c89",
    storageBucket: "my-instagram-93c89.appspot.com",
    messagingSenderId: "311708835608",
    appId: "1:311708835608:web:d172386e2a786d9d3f086d"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export {app, auth, db}; 