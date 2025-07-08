import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, updateDoc, doc, Timestamp } from "firebase/firestore";

const categorias = ["Salário", "Alimentação", "Transporte", "Lazer", "Outro"];

export default function TransactionForm({ onSubmitComplete, transacaoParaEditar }) {
  const [tipo, setTipo] = useState("receita");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState("Outro");
  const [data, setData] = useState("");

  useEffect(() => {
    if (transacaoParaEditar) {
      setTipo(transacaoParaEditar.tipo);
      setDescricao(transacaoParaEditar.descricao);
      setValor(transacaoParaEditar.valor.toString());
      setCategoria(transacaoParaEditar.categoria);

      const dateObj = transacaoParaEditar.data.seconds
        ? new Date(transacaoParaEditar.data.seconds * 1000)
        : new Date();
      const isoString = dateObj.toISOString();
      setData(isoString.substring(0, 16));
    } else {
      setTipo("receita");
      setDescricao("");
      setValor("");
      setCategoria("Outro");
      setData("");
    }
  }, [transacaoParaEditar]);

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

    const transacaoData = {
      tipo,
      descricao: descricao.trim(),
      valor: parseFloat(valor),
      categoria,
      data: Timestamp.fromDate(new Date(data)),
    };

    try {
      if (transacaoParaEditar) {
        const docRef = doc(db, "transacoes", transacaoParaEditar.id);
        await updateDoc(docRef, transacaoData);
      } else {
        await addDoc(collection(db, "transacoes"), transacaoData);
      }

      if (onSubmitComplete) onSubmitComplete();

      if (!transacaoParaEditar) {
        setTipo("receita");
        setDescricao("");
        setValor("");
        setCategoria("Outro");
        setData("");
      }
    } catch (error) {
      console.error("Erro ao salvar a transação:", error);
      alert("Erro ao salvar a transação, tente novamente.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <select
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      >
        <option value="receita">Receita</option>
        <option value="despesa">Despesa</option>
      </select>

      <input
        type="text"
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        required
      />

      <input
        type="number"
        placeholder="Valor (R$)"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        required
        min="0.01"
        step="0.01"
      />

      <select
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      >
        {categorias.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <input
        type="datetime-local"
        value={data}
        onChange={(e) => setData(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        required
      />

      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-md shadow transition"
      >
        {transacaoParaEditar ? "Atualizar" : "Adicionar"}
      </button>
    </form>
  );
}
