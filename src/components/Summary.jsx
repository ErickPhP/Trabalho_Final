import React from "react";
import { useTransacoes } from "../context/TransacoesContext";

export default function Summary() {
  const { transacoes, loading } = useTransacoes();

  const receita = transacoes
    .filter((t) => t.tipo === "receita")
    .reduce((acc, t) => acc + parseFloat(t.valor), 0);

  const despesa = transacoes
    .filter((t) => t.tipo === "despesa")
    .reduce((acc, t) => acc + parseFloat(t.valor), 0);

  const saldo = receita - despesa;

  if (loading) {
    return (
      <div className="max-w-xl mx-auto mt-6 text-center text-gray-600 dark:text-gray-300">
        Carregando resumo...
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-6 flex flex-col sm:flex-row justify-around gap-6 text-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <ResumoCard title="Receitas" value={receita} color="green" />
      <ResumoCard title="Despesas" value={despesa} color="red" />
      <ResumoCard
        title="Saldo"
        value={saldo}
        color={saldo >= 0 ? "green" : "red"}
        destaque
      />
    </div>
  );
}

function ResumoCard({ title, value, color, destaque = false }) {
  const borderColor = `border-${color}-500`;
  const textColor = destaque
    ? `text-${color}-700 dark:text-${color}-400`
    : `text-${color}-600`;

  return (
    <div className={`flex-1 border-l-4 ${borderColor} pl-4`}>
      <p className={`font-bold text-lg ${textColor}`}>{title}</p>
      <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        R$ {value.toFixed(2)}
      </p>
    </div>
  );
}
