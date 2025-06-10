import { useSearch } from "../hooks/useSearch";

const VerticalSearchForm = ({ onSubmit }) => {
  const {
    searchParams,
    cities,
    neighborhoods,
    categories,
    subCategories,
    handleSearchChange,
    handleSearchSubmit,
  } = useSearch();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSearchSubmit(searchParams); // Chama a função original do hook

    // Chama a função onSubmit se existir
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4 z-99">
      <h3 className="text-lg font-semibold mb-4">Filtrar resultados</h3>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {/* Campo de Nome */}
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome do estabelecimento
          </label>
          <input
            type="text"
            name="name"
            value={searchParams.name}
            onChange={handleSearchChange}
            className="w-full px-4 py-1.5 rounded-lg border border-gray-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-blue-950"
            placeholder="Digite o nome"
          />
        </div>

        {/* Cidade */}
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cidade
          </label>
          <select
            name="city"
            value={searchParams.city}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione uma cidade</option>
            {cities.map((city) => (
              <option key={city._id} value={city.slug}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* Bairro (só aparece quando cidade selecionada) */}
        {searchParams.city && (
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bairro
            </label>
            <select
              name="neighborhood"
              value={searchParams.neighborhood}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos os bairros</option>
              {neighborhoods.length > 0 ? (
                neighborhoods.map((n) => (
                  <option key={n._id} value={n.slug}>
                    {n.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Nenhum bairro encontrado
                </option>
              )}
            </select>
          </div>
        )}

        {/* Categoria */}
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoria
          </label>
          <select
            name="category"
            value={searchParams.category}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas categorias</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategoria (só aparece quando categoria selecionada) */}
        {searchParams.category && (
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subcategoria
            </label>
            <select
              name="subcategory"
              value={searchParams.subcategory}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas subcategorias</option>
              {subCategories.length > 0 ? (
                subCategories.map((sub) => (
                  <option key={sub._id} value={sub.slug}>
                    {sub.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Nenhuma subcategoria encontrada
                </option>
              )}
            </select>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-[#042f4a] hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Aplicar filtros
        </button>
      </form>
    </div>
  );
};

export default VerticalSearchForm;
