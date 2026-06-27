// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "vingo-food-delivery-6da3b.firebaseapp.com",
  projectId: "vingo-food-delivery-6da3b",
  storageBucket: "vingo-food-delivery-6da3b.firebasestorage.app",
  messagingSenderId: "507870870082",
  appId: "1:507870870082:web:6ee68a01efb8cdb29b4bdb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);//app ke through hum saari cheeze kr sakhte h jo hume firebase ke through krani h
const auth=getAuth(app);//auth ke through hum authentication kr sakhte h
export {app, auth}