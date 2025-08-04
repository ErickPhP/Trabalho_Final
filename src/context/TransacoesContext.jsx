import React, { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../lib/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const TransacoesContext = createContext();

export function TransacoesProvider({ children }) {
  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [operando, setOperando] = useState(false);
  const [erro, setErro] = useState(null);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    let unsubscribeSnapshot = () => {};
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setLoading(true);
      setUsuario(user);

      if (!user) {
        setTransacoes([]);
        setLoading(false);
        return;
      }

      const transacoesRef = collection(db, "users", user.uid, "transacoes");

      unsubscribeSnapshot = onSnapshot(
        transacoesRef,
        (snapshot) => {
          try {
            const lista = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setTransacoes(lista);
            setErro(null);
          } catch (err) {
            console.error("Erro ao processar transações:", err);
            setErro(err);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error("Erro ao carregar transações:", error);
          setErro(error);
          setLoading(false);
        }
      );
    });

    return () => {
      unsubscribeAuth();
      unsubscribeSnapshot();
    };
  }, []);

  const adicionarTransacao = async (dados) => {
    if (!usuario) return;
    setOperando(true);
    try {
      const ref = collection(db, "users", usuario.uid, "transacoes");
      await addDoc(ref, dados);
    } catch (err) {
      console.error("Erro ao adicionar transação:", err);
      setErro(err);
    } finally {
      setOperando(false);
    }
  };

  const editarTransacao = async (id, dados) => {
    if (!usuario) return;
    setOperando(true);
    try {
      const ref = doc(db, "users", usuario.uid, "transacoes", id);
      await updateDoc(ref, dados);
    } catch (err) {
      console.error("Erro ao editar transação:", err);
      setErro(err);
    } finally {
      setOperando(false);
    }
  };

  const excluirTransacao = async (id) => {
    if (!usuario) return;
    setOperando(true);
    try {
      const ref = doc(db, "users", usuario.uid, "transacoes", id);
      await deleteDoc(ref);
    } catch (err) {
      console.error("Erro ao excluir transação:", err);
      setErro(err);
    } finally {
      setOperando(false);
    }
  };

  return (
    <TransacoesContext.Provider
      value={{
        transacoes,
        loading,
        operando,
        erro,
        adicionarTransacao,
        editarTransacao,
        excluirTransacao,
      }}
    >
      {children}
    </TransacoesContext.Provider>
  );
}

export function useTransacoes() {
  return useContext(TransacoesContext);
}
