import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider, db } from "./firebaseConfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import Swal from "sweetalert2";

// 🆕 Registrar novo usuário
export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      criadoEm: serverTimestamp(),
    });

    Swal.fire({
      icon: "success",
      title: "Usuário registrado com sucesso!",
      showConfirmButton: false,
      timer: 3000,
    });

    console.log("Usuário registrado:", user);
    return user;
  } catch (error) {
    console.error("Erro ao registrar:", error.code, error.message);

    let errorMessage = "Erro ao registrar usuário.";

    if (error.code === "auth/email-already-in-use") {
      errorMessage = "E-mail já cadastrado. Tente fazer login.";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "E-mail inválido.";
    } else if (error.code === "auth/weak-password") {
      errorMessage = "A senha deve ter pelo menos 6 caracteres.";
    }

    Swal.fire({
      icon: "error",
      title: errorMessage,
      showConfirmButton: false,
      timer: 3000,
    });

    throw error;
  }
};

// 🔐 Login com email/senha
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    Swal.fire({
      icon: "success",
      title: "Bem-vindo(a) de volta!",
      showConfirmButton: false,
      timer: 3000,
    });

    console.log("Usuário logado:", user);
    return user;
  } catch (error) {
    console.error("Erro ao fazer login:", error.code, error.message);

    let errorMessage = "Erro ao fazer login.";

    if (
      error.code === "auth/invalid-credential" ||
      error.code === "auth/wrong-password" ||
      error.code === "auth/user-not-found"
    ) {
      errorMessage = "E-mail e/ou senha incorretos.";
    }

    Swal.fire({
      icon: "error",
      title: errorMessage,
      showConfirmButton: false,
      timer: 3000,
    });

    throw error;
  }
};

// 🔐 Login com Google
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    await setDoc(
      doc(db, "users", user.uid),
      {
        email: user.email,
        nome: user.displayName,
        foto: user.photoURL,
        criadoEm: serverTimestamp(),
      },
      { merge: true }
    );

    Swal.fire({
      icon: "success",
      title: `Bem-vindo(a), ${user.email}!`,
      showConfirmButton: false,
      timer: 3000,
    });

    console.log("Usuário logado com Google:", user);
    return user;
  } catch (error) {
    console.error("Erro no login Google:", error.code, error.message);

    Swal.fire({
      icon: "error",
      title: `Erro no login Google: ${error.message}`,
      showConfirmButton: false,
      timer: 3000,
    });

    throw error;
  }
};

// 🚪 Logout
export const logout = async () => {
  try {
    await signOut(auth);
    console.log("Usuário deslogado");

    Swal.fire({
      icon: "info",
      title: "Você saiu da conta.",
      showConfirmButton: false,
      timer: 2000,
    });
  } catch (error) {
    console.error("Erro ao fazer logout:", error.code, error.message);

    Swal.fire({
      icon: "error",
      title: `Erro ao deslogar: ${error.message}`,
      showConfirmButton: false,
      timer: 3000,
    });

    throw error;
  }
};