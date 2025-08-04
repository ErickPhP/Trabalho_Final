import React, { useState, useEffect } from "react";
import { db, auth } from "../lib/firebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";

const categoriasPadrao = [
  "Salário",
  "Alimentação",
  "Transporte",
  "Lazer",
  "Outro",
];

export default function TransactionForm({ onSubmitComplete, transacaoParaEditar }) {
  const [tipo, setTipo] = useState("receita");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState("Outro");
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (transacaoParaEditar) {
      setTipo(transacaoParaEditar.tipo);
      setDescricao(transacaoParaEditar.descricao);
      setValor(transacaoParaEditar.valor.toString());
      setCategoria(transacaoParaEditar.categoria || "Outro");
      setData(formatDateForInput(transacaoParaEditar.data));
    } else {
      resetForm();
    }
  }, [transacaoParaEditar]);

  const formatDateForInput = (timestamp) => {
    if (!timestamp) return "";
    const dateObj = timestamp.seconds
      ? new Date(timestamp.seconds * 1000)
      : new Date(timestamp);
    return dateObj.toISOString().substring(0, 16);
  };

  const resetForm = () => {
    setTipo("receita");
    setDescricao("");
    setValor("");
    setCategoria("Outro");
    setData("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!descricao.trim()) {
      alert("Preencha a descrição corretamente!");
      return;
    }

    if (!data) {
      alert("Por favor, selecione uma data e hora.");
      return;
    }

    if (isNaN(parseFloat(valor)) || parseFloat(valor) <= 0) {
      alert("Digite um valor numérico maior que zero.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert("Você precisa estar logado para salvar transações.");
      return;
    }

    const transacaoData = {
      tipo,
      descricao: descricao.trim(),
      valor: parseFloat(valor),
      categoria,
      data: Timestamp.fromDate(new Date(data)),
    };

    setLoading(true);
    try {
      if (transacaoParaEditar) {
        const docRef = doc(
          db,
          "users",
          user.uid,
          "transacoes",
          transacaoParaEditar.id
        );
        await updateDoc(docRef, transacaoData);
      } else {
        await addDoc(collection(db, "users", user.uid, "transacoes"), transacaoData);
      }

      if (onSubmitComplete) onSubmitComplete();
      if (!transacaoParaEditar) resetForm();
    } catch (error) {
      console.error("Erro ao salvar a transação:", error);
      alert("Erro ao salvar a transação, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md space-y-6"
    >
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 text-center">
        {transacaoParaEditar ? "Editar Transação" : "Nova Transação"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="receita">Receita</option>
          <option value="despesa">Despesa</option>
        </select>

        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {categoriasPadrao.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <input
        type="text"
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        required
      />

      <input
        type="number"
        placeholder="Valor (R$)"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        required
        min="0.01"
        step="0.01"
      />

      <input
        type="datetime-local"
        value={data}
        onChange={(e) => setData(e.target.value)}
        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-md shadow-md transition duration-200 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading
          ? "Salvando..."
          : transacaoParaEditar
          ? "Atualizar"
          : "Adicionar"}
      </button>
    </form>
  );
}