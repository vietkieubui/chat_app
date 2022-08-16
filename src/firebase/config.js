import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getFirestore } from "firebase/firestore";
// import {  connectFirestoreEmulator } from "firebase/firestore";
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { connectAuthEmulator } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAVLJYr-uIyXxYpat-CS1S3aWpAzrXoOw0",
  authDomain: "chat-app-7a7d1.firebaseapp.com",
  projectId: "chat-app-7a7d1",
  storageBucket: "chat-app-7a7d1.appspot.com",
  messagingSenderId: "897848476036",
  appId: "1:897848476036:web:9319c19879821eee6e1dd1",
  measurementId: "G-PV0MC9PRMC",
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);

// connectAuthEmulator(auth, "http://localhost:9099");
// if(window.location.hostname==='localhost'){
//   connectFirestoreEmulator(db, 'localhost', 8080);
// }

export { auth, db };
export default firebase;
