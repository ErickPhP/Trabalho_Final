import React from "react";
import { useTransacoes } from "../context/TransacoesContext";

export default function Resumo() {
  const { transacoes, loading } = useTransacoes();

  const totalReceita = transacoes
    .filter((t) => t.tipo === "receita")
    .reduce((acc, t) => acc + parseFloat(t.valor), 0);

  const totalDespesa = transacoes
    .filter((t) => t.tipo === "despesa")
    .reduce((acc, t) => acc + parseFloat(t.valor), 0);

  const saldo = totalReceita - totalDespesa;

  const Card = ({ title, value, color }) => (
    <div
      className={`bg-white dark:bg-gray-800 border-l-4 ${color} p-4 rounded-lg shadow-md text-center`}
    >
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
        {title}
      </h3>
      <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">
        R$ {value.toFixed(2)}
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mb-10 px-4 sm:px-6 md:px-8 text-center">
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Carregando resumo financeiro...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mb-10 px-4 sm:px-6 md:px-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
        Resumo Financeiro
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card title="Receitas" value={totalReceita} color="border-green-500" />
        <Card title="Despesas" value={totalDespesa} color="border-red-500" />
        <Card
          title="Saldo"
          value={saldo}
          color={saldo >= 0 ? "border-green-500" : "border-red-500"}
        />
      </div>
    </div>
  );
}
