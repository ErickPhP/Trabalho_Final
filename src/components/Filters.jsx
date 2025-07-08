import React, { useState, useEffect } from 'react';

export default function Filters({ onChange, categories }) {
  const [mes, setMes] = useState('');
  const [tipo, setTipo] = useState('');
  const [categoria, setCategoria] = useState('');

  useEffect(() => {
    onChange({ mes, tipo, categoria });
  }, [mes, tipo, categoria, onChange]);

  return (
    <div className="flex flex-wrap gap-4 bg-gray-50 p-4 rounded shadow mt-4">
      <select
        value={mes}
        onChange={(e) => setMes(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="">Todos os meses</option>
        {[...Array(12)].map((_, i) => {
          const numero = (i + 1).toString().padStart(2, '0');
          return (
            <option key={numero} value={numero}>
              {numero} –{' '}
              {new Date(0, i).toLocaleString('pt-BR', { month: 'long' })}
            </option>
          );
        })}
      </select>

      <select
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="">Todos os tipos</option>
        <option value="receita">Receita</option>
        <option value="despesa">Despesa</option>
      </select>

      <select
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="">Todas categorias</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}
