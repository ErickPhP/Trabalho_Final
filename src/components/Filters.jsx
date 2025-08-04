import React, { useState, useEffect } from "react";

export default function Filters({ onChange, categories = [] }) {
  const [mes, setMes] = useState("");
  const [tipo, setTipo] = useState("");
  const [categoria, setCategoria] = useState("");

  useEffect(() => {
    onChange({ mes, tipo, categoria });
  }, [mes, tipo, categoria, onChange]);

  const meses = [...Array(12)].map((_, i) => {
    const numero = (i + 1).toString().padStart(2, "0");
    const nomeMes = new Date(0, i).toLocaleString("pt-BR", { month: "long" });
    return {
      value: numero,
      label: `${numero} – ${nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1)}`,
    };
  });

  const selectClasses =
    "p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md mt-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Filtros
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Mês */}
        <select value={mes} onChange={(e) => setMes(e.target.value)} className={selectClasses}>
          <option value="">Todos os meses</option>
          {meses.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        {/* Tipo */}
        <select value={tipo} onChange={(e) => setTipo(e.target.value)} className={selectClasses}>
          <option value="">Todos os tipos</option>
          <option value="receita">Receita</option>
          <option value="despesa">Despesa</option>
        </select>

        {/* Categoria */}
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className={selectClasses}
        >
          <option value="">Todas categorias</option>
          {categories.length > 0 ? (
            categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))
          ) : (
            <option disabled>Sem categorias disponíveis</option>
          )}
        </select>
      </div>
    </div>
  );
}
