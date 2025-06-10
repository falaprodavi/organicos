import { useState, useEffect } from "react";
import CitiesService from "../../api/services/city";
import { slugify } from "../../utils/helpers";
import useScrollToTop from "../../hooks/useScrollToTop";

const CitiesManager = () => {
  useScrollToTop();
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    image: null,
    isPopular: false,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const data = await CitiesService.getAll();
      setCities(data);
      setLoading(false);
    } catch (error) {
      setMessage({ text: "Erro ao carregar cidades", type: "error" });
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name !== "name" || editingId) {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);

      setFormData({
        ...formData,
        image: file,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("slug", formData.slug);
      formDataToSend.append("isPopular", formData.isPopular);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      if (editingId) {
        await CitiesService.update(editingId, formDataToSend);
        setMessage({ text: "Cidade atualizada com sucesso!", type: "success" });
      } else {
        await CitiesService.create(formDataToSend);
        setMessage({ text: "Cidade criada com sucesso!", type: "success" });
      }

      fetchCities();
      resetForm();
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Erro ao salvar cidade",
        type: "error",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      image: null,
      isPopular: false,
    });
    setPreviewImage(null);
    setEditingId(null);
  };

  const handleEdit = async (city) => {
    try {
      // Carrega os dados completos da cidade (caso seu getAll não retorne todos os campos)
      const cityData = await CitiesService.getById(city._id);

      setFormData({
        name: cityData.name,
        slug: cityData.slug,
        image: null, // Resetamos a imagem para evitar conflitos
        isPopular: cityData.isPopular,
      });

      // Se a cidade já tem uma imagem, cria a preview
      if (cityData.image) {
        setPreviewImage(
          cityData.image.startsWith("http")
            ? cityData.image
            : `${process.env.REACT_APP_API_URL}/${cityData.image}`
        );
      }

      setEditingId(city._id);
    } catch (error) {
      setMessage({
        text: "Erro ao carregar dados da cidade para edição",
        type: "error",
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta cidade?")) {
      try {
        await CitiesService.delete(id);
        setMessage({ text: "Cidade excluída com sucesso!", type: "success" });
        await fetchCities();

        if (editingId === id) {
          resetForm();
        }
      } catch (error) {
        console.error("Erro detalhado:", error);

        let errorMessage = "Erro ao excluir cidade";
        if (error.response) {
          // Se o backend retornou uma mensagem específica
          errorMessage = error.response.data?.message || errorMessage;
        } else if (error.request) {
          // A requisição foi feita mas não houve resposta
          errorMessage = "Sem resposta do servidor";
        }

        setMessage({
          text: errorMessage,
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
      <h2 className="text-2xl font-bold">Gerenciar Cidades</h2>

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
          {editingId ? "Editar Cidade" : "Adicionar Nova Cidade"}
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

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imagem
            </label>
            <div className="flex items-center space-x-4">
              {previewImage && (
                <div className="w-20 h-20 rounded-md overflow-hidden">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                  accept="image/*"
                />
                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG, JPEG até 5MB
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isPopular"
              checked={formData.isPopular}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Cidade Popular
            </label>
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

      {/* Lista de Cidades */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Lista de Cidades</h3>
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
                  Popular
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cities.map((city) => (
                <tr key={city._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{city.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{city.slug}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {city.isPopular ? "✅" : "❌"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button
                      onClick={() => handleEdit(city)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(city._id)}
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

export default CitiesManager;
