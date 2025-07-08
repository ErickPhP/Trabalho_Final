import React from 'react';
import { useNavigate } from 'react-router-dom';
import Relatorio from './Relatorio';

export default function RelatorioPage({ transacoes }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <button
        onClick={() => navigate(-1)} // volta para página anterior
        className="mb-6 px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 font-semibold shadow transition"
      >
        ← Voltar
      </button>

      <Relatorio transacoes={transacoes} />
    </div>
  );
}
