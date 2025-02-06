// src/firebase.js

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

// Your Firebase config (same as in your provided code)
const firebaseConfig = {
  apiKey: "AIzaSyClcf6EzI1zNEmo-PR7gN1c5FvYKWyYlao",
  authDomain: "formscammer-22ee4.firebaseapp.com",
  databaseURL: "https://formscammer-22ee4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "formscammer-22ee4",
  storageBucket: "formscammer-22ee4.firebasestorage.app",
  messagingSenderId: "859785544349",
  appId: "1:859785544349:web:f9a1bd4e2bcd92553cca74",
  measurementId: "G-VTXHBTK2RZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the database
const db = getDatabase(app);

export { db, ref, set };
