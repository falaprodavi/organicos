import { useState, useEffect } from "react";
import SubCategoryService from "../../api/services/subcategory";
import CategoryService from "../../api/services/category";
import { slugify } from "../../utils/helpers";
import useScrollToTop from "../../hooks/useScrollToTop";

const SubCategoriesManager = () => {
  useScrollToTop();
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    icon: null,
    category: "",
    active: true,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subCategoriesData, categoriesData] = await Promise.all([
        SubCategoryService.getAll(),
        CategoryService.getAll(),
      ]);
      setSubCategories(subCategoriesData);
      setCategories(categoriesData);
      setLoading(false);
    } catch (error) {
      setMessage({ text: "Erro ao carregar dados", type: "error" });
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
      if (!formData.category) {
        throw new Error("Selecione uma categoria");
      }

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("slug", formData.slug);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("active", formData.active);
      if (formData.icon) {
        formDataToSend.append("icon", formData.icon);
      }

      if (editingId) {
        await SubCategoryService.update(editingId, formDataToSend);
        setMessage({
          text: "Subcategoria atualizada com sucesso!",
          type: "success",
        });
      } else {
        await SubCategoryService.create(formDataToSend);
        setMessage({
          text: "Subcategoria criada com sucesso!",
          type: "success",
        });
      }

      fetchData();
      resetForm();
    } catch (error) {
      setMessage({
        text:
          error.response?.data?.message ||
          error.message ||
          "Erro ao salvar subcategoria",
        type: "error",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      icon: null,
      category: "",
      active: true,
    });
    setPreviewImage(null);
    setEditingId(null);
  };

  const handleEdit = async (subCategory) => {
    try {
      console.log("Iniciando edição - ID:", subCategory._id);

      // Forçar um estado limpo antes de carregar os novos dados
      setFormData({
        name: "",
        slug: "",
        icon: null,
        category: "",
        active: true,
      });
      setPreviewImage(null);

      // Definir o editingId ANTES de carregar os dados
      setEditingId(subCategory._id);

      const subCategoryData = await SubCategoryService.getById(subCategory._id);
      console.log("Dados recebidos:", subCategoryData);

      setFormData({
        name: subCategoryData.name,
        slug: subCategoryData.slug,
        icon: null, // Reset para evitar conflitos
        category: subCategoryData.category._id || subCategoryData.category,
        active: subCategoryData.active,
      });

      if (subCategoryData.icon) {
        setPreviewImage(
          subCategoryData.icon.startsWith("http")
            ? subCategoryData.icon
            : `${process.env.REACT_APP_API_URL}/${subCategoryData.icon}`
        );
      }

      console.log("Edição configurada para ID:", subCategory._id);
    } catch (error) {
      console.error("Erro ao editar:", error);
      setEditingId(null); // Reset em caso de erro
      setMessage({
        text: "Erro ao carregar dados da subcategoria para edição",
        type: "error",
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta subcategoria?")) {
      try {
        await SubCategoryService.delete(id);
        setMessage({
          text: "Subcategoria excluída com sucesso!",
          type: "success",
        });
        await fetchData();

        if (editingId === id) {
          resetForm();
        }
      } catch (error) {
        setMessage({
          text: error.response?.data?.message || "Erro ao excluir subcategoria",
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
      <h2 className="text-2xl font-bold">Gerenciar Subcategorias</h2>

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
          {editingId ? "Editar Subcategoria" : "Adicionar Nova Subcategoria"}
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
              Categoria
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ícone
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
              name="active"
              checked={formData.active}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">Ativo</label>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {editingId !== null ? "Atualizar" : "Adicionar"}
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

      {/* Lista de Subcategorias */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Lista de Subcategorias</h3>
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
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subCategories.map((subCategory) => (
                <tr key={subCategory._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {subCategory.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {subCategory.slug}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {subCategory.category?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {subCategory.active ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Ativo
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Inativo
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button
                      onClick={() => handleEdit(subCategory)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(subCategory._id)}
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

export default SubCategoriesManager;
