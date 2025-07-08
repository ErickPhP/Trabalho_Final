import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function Summary() {
  const [receita, setReceita] = useState(0);
  const [despesa, setDespesa] = useState(0);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "transacoes"), (snapshot) => {
      let totalReceita = 0, totalDespesa = 0;
      snapshot.docs.forEach((doc) => {
        const { tipo, valor } = doc.data();
        if (tipo === "receita") totalReceita += valor;
        else totalDespesa += valor;
      });

      setReceita(totalReceita);
      setDespesa(totalDespesa);
    });

    return () => unsub();
  }, []);

  return (
    <div className="flex justify-around mt-6 text-center">
      <div>
        <p className="text-green-600 font-bold">Receitas</p>
        <p>R$ {receita.toFixed(2)}</p>
      </div>
      <div>
        <p className="text-red-600 font-bold">Despesas</p>
        <p>R$ {despesa.toFixed(2)}</p>
      </div>
      <div>
        <p className="text-gray-700 font-bold">Saldo</p>
        <p>R$ {(receita - despesa).toFixed(2)}</p>
      </div>
    </div>
  );
}
