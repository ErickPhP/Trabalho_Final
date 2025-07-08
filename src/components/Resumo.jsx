import React from "react";

export default function Resumo({ transacoes }) {
  const totalReceita = transacoes
    .filter((t) => t.tipo === "receita")
    .reduce((acc, t) => acc + parseFloat(t.valor), 0);

  const totalDespesa = transacoes
    .filter((t) => t.tipo === "despesa")
    .reduce((acc, t) => acc + parseFloat(t.valor), 0);

  const saldo = totalReceita - totalDespesa;

  return (
    <div className="max-w-xl mx-auto mb-8 p-6 bg-white rounded shadow text-center">
      <h2 className="text-2xl font-bold mb-6">Resumo Financeiro</h2>
      <div className="flex justify-around text-lg font-semibold">
        <div className="bg-green-100 text-green-800 p-4 rounded w-1/3">
          Receitas
          <br />
          R$ {totalReceita.toFixed(2)}
        </div>
        <div className="bg-red-100 text-red-800 p-4 rounded w-1/3">
          Despesas
          <br />
          R$ {totalDespesa.toFixed(2)}
        </div>
        <div
          className={`p-4 rounded w-1/3 ${
            saldo >= 0 ? "bg-green-200 text-green-900" : "bg-red-200 text-red-900"
          }`}
        >
          Saldo
          <br />
          R$ {saldo.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
