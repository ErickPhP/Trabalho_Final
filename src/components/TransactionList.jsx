import React, { useState, useMemo } from "react";
import Modal from "./Modal";
import TransactionForm from "./TransactionForm";
import Notificacao from "./Notificacao";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useTransacoes } from "../context/TransacoesContext";

export default function TransactionList() {
  const { transacoes, excluirTransacao, operando } = useTransacoes();

  const [modalEdicao, setModalEdicao] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);
  const [transacaoSelecionada, setTransacaoSelecionada] = useState(null);
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");

  const categorias = useMemo(() => {
    const cats = transacoes.map((t) => t.categoria);
    return ["todas", ...Array.from(new Set(cats))];
  }, [transacoes]);

  const transacoesFiltradas = useMemo(() => {
    if (categoriaFiltro === "todas") return transacoes;
    return transacoes.filter((t) => t.categoria === categoriaFiltro);
  }, [categoriaFiltro, transacoes]);

  const abrirModalEdicao = (transacao) => {
    setTransacaoSelecionada(transacao);
    setModalEdicao(true);
  };

  const abrirModalExcluir = (transacao) => {
    setTransacaoSelecionada(transacao);
    setModalExcluir(true);
  };

  const confirmarExclusao = async () => {
    if (!transacaoSelecionada) return;

    await excluirTransacao(transacaoSelecionada.id);
    setMensagem("🗑️ Transação excluída com sucesso!");
    setTipoMensagem("erro");
    setTimeout(() => {
      setMensagem("");
      setTipoMensagem("");
    }, 3000);

    setModalExcluir(false);
    setTransacaoSelecionada(null);
  };

  return (
    <>
      <Notificacao mensagem={mensagem} tipo={tipoMensagem} />
      <div className="max-w-4xl mx-auto space-y-6 p-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center">
          Transações
        </h2>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
          <label className="font-medium text-gray-700 dark:text-gray-300">
            Filtrar por categoria:
          </label>
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            className="p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "todas" ? "Todas" : cat}
              </option>
            ))}
          </select>
        </div>

        {transacoesFiltradas.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Nenhuma transação encontrada.
          </p>
        ) : (
          transacoesFiltradas.map((t) => (
            <div
              key={t.id}
              className={`border-l-4 p-4 rounded-lg shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
                t.tipo === "receita"
                  ? "border-green-500 bg-green-50 dark:bg-green-900 text-green-900 dark:text-green-100"
                  : "border-red-500 bg-red-50 dark:bg-red-900 text-red-900 dark:text-red-100"
              }`}
            >
              <div>
                <p className="font-semibold text-lg">{t.descricao}</p>
                <p className="text-sm">
                  {t.tipo === "despesa" ? "Despesa" : "Receita"} - R${" "}
                  {parseFloat(t.valor).toFixed(2)} <br />
                  Categoria: {t.categoria} <br />
                  Data: {new Date(t.data.seconds * 1000).toLocaleString("pt-BR")}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => abrirModalEdicao(t)}
                  className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition"
                  title="Editar"
                >
                  <PencilSquareIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => abrirModalExcluir(t)}
                  className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition"
                  title="Excluir"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}

        {modalEdicao && (
          <Modal isOpen={modalEdicao} onClose={() => setModalEdicao(false)}>
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800 dark:text-gray-100">
              Editar Transação
            </h2>
            <TransactionForm
              transacaoParaEditar={transacaoSelecionada}
              onSubmitComplete={() => {
                setModalEdicao(false);
                setTransacaoSelecionada(null);
              }}
              setMensagem={setMensagem}
              setTipoMensagem={setTipoMensagem}
            />
          </Modal>
        )}

        {modalExcluir && (
          <Modal isOpen={modalExcluir} onClose={() => setModalExcluir(false)}>
            <h2 className="text-xl font-semibold mb-4 text-center text-red-600 dark:text-red-400">
              Confirmar Exclusão
            </h2>
            <p className="mb-6 text-center text-gray-700 dark:text-gray-300">
              Tem certeza que deseja excluir a transação{" "}
              <strong>{transacaoSelecionada?.descricao}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setModalExcluir(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded transition"
                disabled={operando}
              >
                Cancelar
              </button>
              <button
                onClick={confirmarExclusao}
                className={`px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition ${
                  operando ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={operando}
              >
                {operando ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
}
