import { useState, useEffect } from "react";
import NeighborhoodService from "../../api/services/neighborhood";
import CityService from "../../api/services/city";
import { slugify } from "../../utils/helpers";
import useScrollToTop from "../../hooks/useScrollToTop";

const NeighborhoodsManager = () => {
  useScrollToTop();
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    city: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [neighborhoodsData, citiesData] = await Promise.all([
        NeighborhoodService.getAll(),
        CityService.getActiveCities(),
      ]);
      setNeighborhoods(neighborhoodsData);
      setCities(citiesData);
      setLoading(false);
    } catch (error) {
      setMessage({ text: "Erro ao carregar dados", type: "error" });
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name !== "name" || editingId) {
      setFormData({
        ...formData,
        [name]: value,
      });
    } else {
      setFormData({
        ...formData,
        name: value,
        slug: slugify(value),
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Verificação adicional
      if (!formData.name || !formData.city) {
        throw new Error("Preencha todos os campos obrigatórios");
      }

      const payload = {
        name: formData.name,
        city: formData.city,
      };

      console.log("Payload sendo enviado:", payload); // Debug

      if (editingId) {
        await NeighborhoodService.update(editingId, payload);
        setMessage({ text: "Bairro atualizado com sucesso!", type: "success" });
      } else {
        await NeighborhoodService.create(payload);
        setMessage({ text: "Bairro criado com sucesso!", type: "success" });
      }

      fetchData();
      resetForm();
    } catch (error) {
      console.error("Erro no submit:", {
        message: error.message,
        response: error.response?.data,
      });

      setMessage({
        text:
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Erro ao salvar bairro",
        type: "error",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      city: "",
    });
    setEditingId(null);
  };

  const handleEdit = async (neighborhood) => {
    try {
      const neighborhoodData = await NeighborhoodService.getById(
        neighborhood._id
      );

      setFormData({
        name: neighborhoodData.name,
        slug: neighborhoodData.slug,
        city: neighborhoodData.city._id || neighborhoodData.city,
      });

      setEditingId(neighborhood._id);
    } catch (error) {
      setMessage({
        text: "Erro ao carregar dados do bairro para edição",
        type: "error",
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este bairro?")) {
      try {
        await NeighborhoodService.delete(id);
        setMessage({ text: "Bairro excluído com sucesso!", type: "success" });
        await fetchData();

        if (editingId === id) {
          resetForm();
        }
      } catch (error) {
        setMessage({
          text: error.response?.data?.message || "Erro ao excluir bairro",
          type: "error",
        });
      }
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gerenciar Bairros</h2>

      {message.text && (
        <div
          className={`p-4 mb-4 rounded-md ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">
          {editingId ? "Editar Bairro" : "Adicionar Novo Bairro"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cidade
            </label>
            <select
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Selecione uma cidade</option>
              {cities.map((city) => (
                <option key={city._id} value={city._id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {editingId ? "Atualizar" : "Adicionar"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista de Bairros */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Lista de Bairros</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {neighborhoods.map((neighborhood) => (
                <tr key={neighborhood._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {neighborhood.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {neighborhood.slug}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {neighborhood.city?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button
                      onClick={() => handleEdit(neighborhood)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(neighborhood._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NeighborhoodsManager;
