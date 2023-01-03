// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAXuIuiISalFh5GVcs3ZtEOatC8KLPSetY",
    authDomain: "mabarbeetmoi-32186.firebaseapp.com",
    projectId: "mabarbeetmoi-32186",
    storageBucket: "mabarbeetmoi-32186.appspot.com",
    messagingSenderId: "272431746650",
    appId: "1:272431746650:web:ee564138027fae2c2d1263",
    measurementId: "G-Y02C0XYLPQ"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//initialize firebase auth
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { app, auth, db, storage }