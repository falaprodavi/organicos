// src/components/HorizontalSearchForm.jsx
import React from "react";

const HorizontalSearchForm = ({
  searchParams,
  cities,
  neighborhoods,
  categories,
  subCategories,
  onSearchChange,
  onSearchSubmit,
  isLoading,
}) => {
  return (
    <form
      onSubmit={onSearchSubmit}
      className="flex flex-col md:flex-row md:items-end md:space-x-4 space-y-4 md:space-y-0"
    >
      {/* Campo de Nome */}
      <div className="flex-1">
        <input
          type="text"
          name="name"
          value={searchParams.name}
          onChange={onSearchChange}
          placeholder="Digite o nome"
          className="w-full px-4 py-1.5 rounded-lg border border-gray-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
          disabled={isLoading}
        />
      </div>

      {/* Cidade */}
      <div className="flex-1 md:w-48">
        <select
          name="city"
          value={searchParams.city}
          onChange={onSearchChange}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          <option value="">Cidades</option>
          {cities.map((city) => (
            <option key={city._id} value={city.slug}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      {/* Bairro (só aparece quando cidade selecionada) */}
      {searchParams.city && (
        <div className="flex-1 md:w-48">
          <select
            name="neighborhood"
            value={searchParams.neighborhood}
            onChange={onSearchChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            <option value="">Bairros</option>
            {neighborhoods.map((n) => (
              <option key={n._id} value={n.slug}>
                {n.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Categoria */}
      <div className="flex-1 md:w-48">
        <select
          name="category"
          value={searchParams.category}
          onChange={onSearchChange}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          <option value="">Categorias</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Subcategoria (só aparece quando categoria selecionada) */}
      {searchParams.category && (
        <div className="flex-1 md:w-48">
          <select
            name="subcategory"
            value={searchParams.subcategory}
            onChange={onSearchChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            <option value="">Subcategoria</option>
            {subCategories.map((sub) => (
              <option key={sub._id} value={sub.slug}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        type="submit"
        className="w-full md:w-auto px-6 py-2 rounded-lg bg-[#ff914d] text-white font-semibold hover:bg-orange-300 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? "Buscando..." : "Buscar"}
      </button>
    </form>
  );
};

export default HorizontalSearchForm;
