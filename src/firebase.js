// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCrOn1Cwg3qOtVMnceeyPORHe7Lcb6aFY",
  authDomain: "controle-financeiro-app-6088f.firebaseapp.com",
  projectId: "controle-financeiro-app-6088f",
  storageBucket: "controle-financeiro-app-6088f.firebasestorage.app",
  messagingSenderId: "134483441176",
  appId: "1:134483441176:web:bcd4cded387d213f6b756d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);