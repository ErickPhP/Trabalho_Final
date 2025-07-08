import React, { useEffect, useState, useMemo } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import Modal from './Modal';
import TransactionForm from './TransactionForm';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function TransactionList() {
  const [transacoes, setTransacoes] = useState([]);
  const [modalEdicao, setModalEdicao] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);
  const [transacaoSelecionada, setTransacaoSelecionada] = useState(null);
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas'); // estado filtro

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'transacoes'), (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTransacoes(lista);
    });

    return () => unsubscribe();
  }, []);

  // Extrair categorias únicas das despesas para o filtro
  const categorias = useMemo(() => {
    const cats = transacoes
      .filter((t) => t.tipo === 'despesa')
      .map((t) => t.categoria);
    return ['todas', ...Array.from(new Set(cats))];
  }, [transacoes]);

  // Aplicar filtro de categoria nas transações
  const transacoesFiltradas = useMemo(() => {
    if (categoriaFiltro === 'todas') return transacoes;
    return transacoes.filter(
      (t) => t.tipo === 'despesa' && t.categoria === categoriaFiltro
    );
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
    await deleteDoc(doc(db, 'transacoes', transacaoSelecionada.id));
    setModalExcluir(false);
    setTransacaoSelecionada(null);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Transações</h2>

      {/* Filtro de Categoria */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">
          Filtrar Categoria de Despesa:
        </label>
        <select
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        >
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'todas' ? 'Todas' : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Lista filtrada */}
      {transacoesFiltradas.length === 0 ? (
        <p className="text-center text-gray-500">
          Nenhuma transação encontrada.
        </p>
      ) : (
        transacoesFiltradas.map((t) => (
          <div
            key={t.id}
            className={`p-4 rounded shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ${
              t.tipo === 'receita'
                ? 'bg-green-100 text-green-900'
                : 'bg-red-100 text-red-900'
            }`}
          >
            <div>
              <p className="font-semibold">{t.descricao}</p>
              <p className="text-sm">
                {t.tipo === 'despesa' ? 'Despesa' : 'Receita'} - R${' '}
                {parseFloat(t.valor).toFixed(2)} <br />
                Categoria: {t.categoria} <br />
                Data: {new Date(t.data.seconds * 1000).toLocaleString('pt-BR')}
              </p>
            </div>

            <div className="flex gap-2 mt-2 sm:mt-0">
              <button
                onClick={() => abrirModalEdicao(t)}
                className="p-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-full"
                title="Editar"
              >
                <PencilSquareIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => abrirModalExcluir(t)}
                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full"
                title="Excluir"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))
      )}

      {/* Modal de Edição */}
      {modalEdicao && (
        <Modal isOpen={modalEdicao} onClose={() => setModalEdicao(false)}>
          <h2 className="text-xl font-bold mb-4 text-center">
            Editar Transação
          </h2>
          <TransactionForm
            transacaoParaEditar={transacaoSelecionada}
            onSubmitComplete={() => setModalEdicao(false)}
          />
        </Modal>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {modalExcluir && (
        <Modal isOpen={modalExcluir} onClose={() => setModalExcluir(false)}>
          <h2 className="text-xl font-semibold mb-4 text-center text-red-600">
            Confirmar Exclusão
          </h2>
          <p className="mb-6 text-center">
            Tem certeza que deseja excluir a transação{' '}
            <strong>{transacaoSelecionada?.descricao}</strong>?
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setModalExcluir(false)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              onClick={confirmarExclusao}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Excluir
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
