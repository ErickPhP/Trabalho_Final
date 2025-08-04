// src/components/Notificacao.jsx
import React from "react";

export default function Notificacao({ mensagem, tipo }) {
  if (!mensagem) return null;

  const cores = {
    sucesso: "#38a169",   // verde
    edicao: "#3182ce",    // azul
    erro: "#e53e3e",      // vermelho
  };

  return (
    <div style={{
      position: "fixed",
      top: "20px",
      right: "20px",
      backgroundColor: cores[tipo] || "#4a5568",
      color: "white",
      padding: "12px 20px",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      zIndex: 1000,
      fontWeight: "bold"
    }}>
      {mensagem}
    </div>
  );
}
