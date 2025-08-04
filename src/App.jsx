import React, { useState, useEffect, useRef } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  Link,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import Modal from "./components/Modal";
import Resumo from "./components/Resumo";
import TransactionList from "./components/TransactionList";
import TransactionForm from "./components/TransactionForm";
import RelatorioPage from "./components/RelatorioPage";
import Login from "./login/Login";

import useAuth from "./lib/useAuth";
import { logout } from "./lib/auth";
import { useTransacoes } from "./context/TransacoesContext";

export default function App() {
  const [modalNovaTransacaoAberto, setModalNovaTransacaoAberto] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef(null);

  const { user: usuario, loading: loadingAuth } = useAuth();
  const { loading: loadingTransacoes } = useTransacoes();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickFora = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAberto(false);
      }
    };
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const getInitials = (email) => {
    if (!email) return "U";
    const name = email.split("@")[0];
    return name.slice(0, 2).toUpperCase();
  };

  if (loadingAuth || loadingTransacoes) {
    return (
      <div className="h-screen flex justify-center items-center text-lg text-gray-700 dark:text-white">
        Carregando dados...
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          usuario ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/login"
        element={!usuario ? <Login /> : <Navigate to="/home" replace />}
      />

      <Route
        path="/home"
        element={
          usuario ? (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-100 px-4 sm:px-6 md:px-8 py-6 relative">
              {/* ✅ Botão de perfil com foto */}
              <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50" ref={menuRef}>
                <button
                  onClick={() => setMenuAberto(!menuAberto)}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-green-600 shadow-md transition focus:outline-none"
                  aria-label="Menu do usuário"
                >
                  {usuario?.photoURL ? (
                    <img
                      src={usuario.photoURL}
                      alt="Foto do usuário"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-green-600 text-white flex items-center justify-center font-bold">
                      {getInitials(usuario?.email)}
                    </div>
                  )}
                </button>

                <AnimatePresence>
                  {menuAberto && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-64 max-w-[90vw] bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-50"
                    >
                      <div className="flex items-center space-x-4 mb-4">
                        {usuario?.photoURL ? (
                          <img
                            src={usuario.photoURL}
                            alt="Foto do usuário"
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                            {getInitials(usuario?.email)}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium truncate max-w-[160px]">
                            {usuario?.email}
                          </p>
                          {usuario?.displayName && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[160px]">
                              {usuario.displayName}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition"
                      >
                        Sair
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <main className="max-w-4xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-10 tracking-tight text-green-700 dark:text-green-400">
                  Meu Orçamento
                </h1>

                <Resumo />
                <div className="flex justify-center my-8">
                  <button
                    onClick={() => setModalNovaTransacaoAberto(true)}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
                  >
                    + Nova Transação
                  </button>
                </div>

                <TransactionList />

                <Modal
                  isOpen={modalNovaTransacaoAberto}
                  onClose={() => setModalNovaTransacaoAberto(false)}
                >
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-gray-900 dark:text-white">
                    Adicionar Transação
                  </h2>
                  <TransactionForm
                    onSubmitComplete={() => setModalNovaTransacaoAberto(false)}
                  />
                </Modal>

                <div className="flex justify-center mt-10">
                  <Link
                    to="/relatorio"
                    className="w-full sm:w-auto text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
                  >
                    Ver Relatório
                  </Link>
                </div>
              </main>
            </div>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/relatorio"
        element={
          usuario ? <RelatorioPage /> : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
}
