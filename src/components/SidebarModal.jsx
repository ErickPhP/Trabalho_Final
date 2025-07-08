import React from "react";

export default function SidebarModal({ isOpen, onClose, onOpenRelatorio }) {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-gray-900 text-white p-6 z-50 shadow-lg flex flex-col">
      <button
        onClick={onClose}
        className="mb-6 self-end hover:text-gray-400 focus:outline-none"
        aria-label="Fechar menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <nav className="flex flex-col gap-6 text-lg">
        <button
          onClick={() => {
            onOpenRelatorio();
            onClose();
          }}
          className="text-left px-4 py-2 rounded hover:bg-gray-700 transition focus:outline-none"
        >
          Gerar Relatório
        </button>

        <button
          onClick={() => alert("Função Login ainda não implementada")}
          className="text-left px-4 py-2 rounded hover:bg-gray-700 transition focus:outline-none"
        >
          Fazer Login
        </button>
      </nav>
    </div>
  );
}
