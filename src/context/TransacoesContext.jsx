// src/context/TransacoesContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db, auth } from "../lib/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const TransacoesContext = createContext();

export function TransacoesProvider({ children }) {
  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let unsubscribeSnapshot = () => {};
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setTransacoes([]);
        setLoading(false);
        return;
      }

      const transacoesRef = collection(db, "users", user.uid, "transacoes");
      unsubscribeSnapshot = onSnapshot(
        transacoesRef,
        (snapshot) => {
          const lista = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTransacoes(lista);
          setLoading(false);
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

  return (
    <TransacoesContext.Provider value={{ transacoes, loading, erro }}>
      {children}
    </TransacoesContext.Provider>
  );
}

export function useTransacoes() {
  return useContext(TransacoesContext);
}
