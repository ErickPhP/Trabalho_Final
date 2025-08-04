import React from "react";
import { useNavigate } from "react-router-dom";
import Relatorio from "./Relatorio";
import { useTransacoes } from "../context/TransacoesContext";

export default function RelatorioPage() {
  const navigate = useNavigate();
  const { transacoes } = useTransacoes();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 md:px-8 py-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-6 py-3 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-lg shadow transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          type="button"
          aria-label="Voltar para página anterior"
        >
          ← Voltar
        </button>

        <Relatorio transacoes={transacoes} />
      </div>
    </div>
  );
}
