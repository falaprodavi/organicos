import { useState, useEffect } from "react";
import CategoryService from "../../api/services/category";
import { slugify } from "../../utils/helpers";
import useScrollToTop from "../../hooks/useScrollToTop";

const CategoriesManager = () => {
  useScrollToTop();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    icon: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await CategoryService.getAll();
      setCategories(data);
      setLoading(false);
    } catch (error) {
      setMessage({ text: "Erro ao carregar categorias", type: "error" });
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
        icon: file,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("slug", formData.slug);
      if (formData.icon) {
        formDataToSend.append("icon", formData.icon);
      }

      if (editingId) {
        await CategoryService.update(editingId, formDataToSend);
        setMessage({
          text: "Categoria atualizada com sucesso!",
          type: "success",
        });
      } else {
        await CategoryService.create(formDataToSend);
        setMessage({ text: "Categorias criada com sucesso!", type: "success" });
      }

      fetchCategories();
      resetForm();
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Erro ao salvar categoria",
        type: "error",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      icon: null,
      isPopular: false,
    });
    setPreviewImage(null);
    setEditingId(null);
  };

  const handleEdit = async (category) => {
    try {
      const categoryData = await CategoryService.getById(category._id);

      // ⚠️ Atualize TODOS os campos necessários (incluindo isPopular se existir)
      setFormData({
        name: categoryData.name,
        slug: categoryData.slug,
        icon: null,
        isPopular: categoryData.isPopular || false, // Adicione se necessário
      });

      // ⚠️ Força uma atualização imediata do estado
      setEditingId(category._id);

      // Opcional: Scroll para o formulário
      document.getElementById("category-form")?.scrollIntoView();
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setMessage({ text: "Erro ao carregar dados", type: "error" });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta categoria?")) {
      try {
        await CategoryService.delete(id);
        setMessage({
          text: "Categorias excluída com sucesso!",
          type: "success",
        });
        await fetchCategories();

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
      <h2 className="text-2xl font-bold">Gerenciar Categorias</h2>

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
          {editingId ? "Editar Categorias" : "Adicionar Nova Categoria"}
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
              Icon
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

      {/* Lista de Categorias */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Lista de Categorias</h3>
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
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {category.slug}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
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

export default CategoriesManager;
