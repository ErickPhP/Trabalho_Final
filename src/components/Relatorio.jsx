import React from "react";
import { useTransacoes } from "../context/TransacoesContext";

export default function Relatorio() {
  const { transacoes, loading } = useTransacoes();

  const totalReceita = transacoes
    .filter((t) => t.tipo === "receita")
    .reduce((acc, t) => acc + parseFloat(t.valor), 0);

  const totalDespesa = transacoes
    .filter((t) => t.tipo === "despesa")
    .reduce((acc, t) => acc + parseFloat(t.valor), 0);

  const saldo = totalReceita - totalDespesa;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-gray-600 dark:text-gray-300 text-lg">
          Carregando relatório detalhado...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800 dark:text-gray-100">
        Relatório Detalhado
      </h2>

      <div className="max-h-[60vh] overflow-y-auto space-y-6 mb-8 px-4">
        {transacoes.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Nenhuma transação encontrada.
          </p>
        ) : (
          transacoes.map((t) => (
            <div
              key={t.id}
              className={`p-4 rounded-lg shadow-md ${
                t.tipo === "receita"
                  ? "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100"
                  : "bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100"
              }`}
            >
              <p>
                <strong>Descrição:</strong> {t.descricao}
              </p>
              <p>
                <strong>Tipo:</strong> {t.tipo === "receita" ? "Receita" : "Despesa"}
              </p>
              <p>
                <strong>Valor:</strong> R$ {parseFloat(t.valor).toFixed(2)}
              </p>
              <p>
                <strong>Categoria:</strong> {t.categoria}
              </p>
              <p>
                <strong>Data:</strong>{" "}
                {new Date(t.data.seconds * 1000).toLocaleString("pt-BR")}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="space-y-5 text-gray-800 dark:text-gray-100 mb-8 px-4">
        <div className="p-5 bg-green-200 dark:bg-green-700 text-green-900 dark:text-green-100 rounded-lg font-semibold shadow-md">
          Total de Receitas: R$ {totalReceita.toFixed(2)}
        </div>
        <div className="p-5 bg-red-200 dark:bg-red-700 text-red-900 dark:text-red-100 rounded-lg font-semibold shadow-md">
          Total de Despesas: R$ {totalDespesa.toFixed(2)}
        </div>
        <div
          className={`p-5 rounded-lg font-bold shadow-md ${
            saldo >= 0
              ? "bg-green-300 text-green-900 dark:bg-green-600 dark:text-green-100"
              : "bg-red-300 text-red-900 dark:bg-red-600 dark:text-red-100"
          }`}
        >
          Saldo: R$ {saldo.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
