import { db } from "./firebaseConfig";
import Swal from "sweetalert2";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

// ➕ Adicionar dados
export async function addData(colecao, data, refStatus = "item") {
  try {
    const docRef = await addDoc(collection(db, colecao), {
      ...data,
      createdAt: serverTimestamp(),
    });
    console.log("Documento adicionado com ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Erro ao adicionar documento:", error.message);
    Swal.fire({
      icon: "error",
      title: `Erro ao adicionar ${refStatus}.`,
      text: "Entre em contato com o suporte!",
      footer: error.message,
      showConfirmButton: false,
      timer: 2500,
    });
    return null;
  }
}

// 🔍 Buscar todos os dados
export async function fetchData(colecao) {
  try {
    const querySnapshot = await getDocs(collection(db, colecao));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Dados recuperados:", data);
    return data;
  } catch (error) {
    console.error("Erro ao buscar dados:", error.message);
    return null;
  }
}

// 🔍 Buscar um documento específico
export async function fetchSingleData(colecao, docId) {
  try {
    if (!colecao || !docId) throw new Error("Coleção ou ID inválido.");

    const docRef = doc(db, colecao, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Dados do documento:", docSnap.data());
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("Nenhum documento encontrado.");
      return null;
    }
  } catch (error) {
    console.error("Erro ao buscar documento:", error.message);
    return null;
  }
}

// ✏️ Atualizar dados
export async function updateData(colecao, docId, data, refStatus = "item") {
  try {
    if (!colecao || !docId) throw new Error("Coleção ou ID inválido.");

    const docRef = doc(db, colecao, docId);
    await updateDoc(docRef, { ...data });

    console.log("Documento atualizado!");
    return true;
  } catch (error) {
    console.error("Erro ao atualizar documento:", error.message);
    Swal.fire({
      icon: "error",
      title: `Erro ao alterar ${refStatus}.`,
      text: "Entre em contato com o suporte!",
      footer: error.message,
      showConfirmButton: false,
      timer: 2500,
    });
    return null;
  }
}

// 🗑️ Deletar documento
export async function deleteData(colecao, docId) {
  try {
    if (!colecao || !docId) throw new Error("Coleção ou ID inválido.");

    const docRef = doc(db, colecao, docId);
    await deleteDoc(docRef);

    console.log("Documento deletado!");
    return true;
  } catch (error) {
    console.error("Erro ao deletar documento:", error.message);
    Swal.fire({
      icon: "error",
      title: "Erro ao excluir o item.",
      text: "Entre em contato com o suporte!",
      footer: error.message,
      showConfirmButton: false,
      timer: 2500,
    });
    return null;
  }
}