import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔐 Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBCrOn1Cwg3qOtVMnceeyPORHe7Lcb6aFY",
  authDomain: "controle-financeiro-app-6088f.firebaseapp.com",
  projectId: "controle-financeiro-app-6088f",
  storageBucket: "controle-financeiro-app-6088f.appspot.com",
  messagingSenderId: "134483441176",
  appId: "1:134483441176:web:bcd4cded387d213f6b756d",
};

// 🔌 Inicialização do app
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// 🔐 Serviços
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// 📤 Exportações
export { auth, db, googleProvider };