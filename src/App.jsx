import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SidebarModal from "./components/SidebarModal";
import Modal from "./components/Modal";
import Resumo from "./components/Resumo";
import TransactionList from "./components/TransactionList";
import TransactionForm from "./components/TransactionForm";
import RelatorioPage from "./components/RelatorioPage";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

export default function App() {
  const [sidebarAberto, setSidebarAberto] = useState(false);
  const [modalNovaTransacaoAberto, setModalNovaTransacaoAberto] = useState(false);
  const [transacoes, setTransacoes] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "transacoes"), (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTransacoes(lista);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-800 p-8">
        {/* Botão hamburguer fixo topo-esquerdo */}
        <button
          className="fixed top-6 left-6 z-50 p-3 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg transition"
          onClick={() => setSidebarAberto(true)}
          aria-label="Abrir menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <SidebarModal
          isOpen={sidebarAberto && !modalNovaTransacaoAberto}
          onClose={() => setSidebarAberto(false)}
        />

        <Routes>
          {/* Página inicial */}
          <Route
            path="/"
            element={
              <>
                <main className="max-w-4xl mx-auto">
                  <h1 className="text-5xl font-extrabold text-center mb-12 tracking-tight text-indigo-700">
                    Meu Orçamento
                  </h1>

                  {/* Resumo */}
                  <Resumo transacoes={transacoes} />

                  {/* Botão Nova Transação */}
                  <div className="flex justify-center my-10">
                    <button
                      onClick={() => setModalNovaTransacaoAberto(true)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-lg shadow-lg transition"
                    >
                      + Nova Transação
                    </button>
                  </div>

                  {/* Lista de Transações */}
                  <TransactionList transacoes={transacoes} />

                  {/* Modal Nova Transação */}
                  <Modal
                    isOpen={modalNovaTransacaoAberto}
                    onClose={() => setModalNovaTransacaoAberto(false)}
                  >
                    <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
                      Adicionar Transação
                    </h2>
                    <TransactionForm onSubmitComplete={() => setModalNovaTransacaoAberto(false)} />
                  </Modal>

                  {/* Botão para ir para Relatório */}
                  <div className="flex justify-center mt-10">
                    <a
                      href="/relatorio"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition"
                    >
                      Ver Relatório
                    </a>
                  </div>
                </main>
              </>
            }
          />

          {/* Página de relatório */}
          <Route path="/relatorio" element={<RelatorioPage transacoes={transacoes} />} />
        </Routes>
      </div>
    </Router>
  );
}
