import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BusinessService from "../../api/services/business";
import CategoryService from "../../api/services/category";
import SubCategoryService from "../../api/services/subcategory";
import CityService from "../../api/services/city";
import NeighborhoodService from "../../api/services/neighborhood";
import useScrollToTop from "../../hooks/useScrollToTop";
import { formatPhoneNumber } from "../../utils/formatPhone";
import { Editor } from "@tinymce/tinymce-react";

const BusinessForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allCategories, setAllCategories] = useState([]);
  const [allSubCategories, setAllSubCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    phone: "",
    whatsapp: "",
    photos: [],
    address: {
      street: "",
      number: "",
      city: "",
      neighborhood: "",
    },
    lat: "",
    long: "",
    category: [],
    subCategory: [],
    instagram: "",
    facebook: "",
    linkedin: "",
    twitter: "",
    tiktok: "",
    site: "",
    video: "",
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });

  useScrollToTop();

  // Carrega todos os dados iniciais
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [categoriesData, citiesData] = await Promise.all([
          CategoryService.getAll(),
          CityService.getAll(),
        ]);

        if (!categoriesData || !citiesData) {
          throw new Error("Dados essenciais não puderam ser carregados");
        }

        setAllCategories(categoriesData.data || categoriesData);
        setCities(citiesData.data || citiesData);

        if (id) {
          const response = await BusinessService.getById(id);
          const businessData = response.data;

          // Carrega bairros se houver cidade
          if (businessData.address?.city?._id) {
            await fetchNeighborhoods(businessData.address.city._id);
          }

          // Carrega subcategorias baseadas nas categorias do negócio
          if (businessData.category?.length > 0) {
            const categoryIds = businessData.category.map((c) => c._id);
            const subCatsResponse = await SubCategoryService.getByCategoryIds(
              categoryIds
            );

            const filteredSubCats = (
              subCatsResponse.data || subCatsResponse
            ).filter((subCat) =>
              businessData.category.some(
                (cat) => cat._id === (subCat.category._id || subCat.category)
              )
            );

            setAllSubCategories(filteredSubCats);
          }

          // Atualiza o formData com os dados do negócio
          setFormData({
            ...businessData,
            address: {
              street: businessData.address?.street || "",
              number: businessData.address?.number || "",
              city: businessData.address?.city?._id || "",
              neighborhood: businessData.address?.neighborhood?._id || "",
            },
            category: businessData.category?.map((c) => c._id) || [],
            subCategory: businessData.subCategory?.map((sc) => sc._id) || [],
          });

          setPreviewImages(businessData.photos || []);
        }
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setMessage({
          text: error.response?.data?.message || "Erro ao carregar dados",
          type: "error",
        });
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id]);

  const fetchNeighborhoods = async (cityId) => {
    try {
      if (!cityId) return;
      const data = await NeighborhoodService.getByCity(cityId);
      setNeighborhoods(data.data || data);
    } catch (error) {
      console.error("Erro ao carregar bairros:", error);
      setNeighborhoods([]);
    }
  };

  const fetchSubCategories = async (categoryIds) => {
    if (!categoryIds || categoryIds.length === 0) {
      setAllSubCategories([]);
      return;
    }

    try {
      const response = await SubCategoryService.getByCategoryIds(categoryIds);

      // Filtra apenas subcategorias que pertencem a pelo menos uma das categorias selecionadas
      const filteredSubCategories = (
        response.data || response
      ).filter((subCat) =>
        categoryIds.includes(subCat.category._id || subCat.category)
      );

      setAllSubCategories(filteredSubCategories);
    } catch (error) {
      console.error("Erro ao carregar subcategorias:", error);
      setAllSubCategories([]);
    }
  };

  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = formatPhoneNumber(value);
    setFormData({
      ...formData,
      [name]: formattedValue,
    });
  };

  const handleMultipleSelectChange = (e) => {
    const { name, options } = e.target;
    const selectedValues = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value);

    setFormData((prev) => ({
      ...prev,
      [name]: selectedValues,
    }));

    // Se mudaram as categorias, carrega as subcategorias correspondentes
    if (name === "category") {
      fetchSubCategories(selectedValues);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [field]: value,
        },
      });

      if (field === "city") {
        fetchNeighborhoods(value);
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 0) {
      const newPreviewImages = [];
      const loadedImages = [];

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviewImages.push(reader.result);
          loadedImages.push(file);

          if (newPreviewImages.length === files.length) {
            setPreviewImages([...previewImages, ...newPreviewImages]);
            setFormData({
              ...formData,
              photos: [...formData.photos, ...loadedImages],
            });
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDeletePhoto = async (photoUrl) => {
    if (window.confirm("Tem certeza que deseja excluir esta foto?")) {
      setLoadingPhoto(true);
      try {
        const decodedUrl = decodeURIComponent(photoUrl);
        await BusinessService.deletePhoto(id, decodedUrl);

        setFormData((prev) => ({
          ...prev,
          photos: prev.photos.filter((photo) => photo !== photoUrl),
        }));

        setPreviewImages((prev) => prev.filter((img) => img !== photoUrl));

        setMessage({
          text: "Foto removida com sucesso!",
          type: "success",
        });
      } catch (error) {
        console.error("Erro completo:", error);
        setMessage({
          text: error.message.includes("Falha ao excluir")
            ? error.message
            : "Erro ao remover foto. Verifique o console.",
          type: "error",
        });
      } finally {
        setLoadingPhoto(false);
      }
    }
  };

  const removeImage = (index) => {
    const imageToRemove = previewImages[index];

    if (typeof imageToRemove === "string" && id) {
      handleDeletePhoto(imageToRemove);
    } else {
      const newPreviewImages = [...previewImages];
      newPreviewImages.splice(index, 1);

      const newPhotos = [...formData.photos];
      newPhotos.splice(index, 1);

      setPreviewImages(newPreviewImages);
      setFormData({
        ...formData,
        photos: newPhotos,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação
    if (formData.category.length === 0) {
      setMessage({ text: "Selecione pelo menos uma categoria", type: "error" });
      return;
    }

    if (formData.subCategory.length === 0) {
      setMessage({
        text: "Selecione pelo menos uma subcategoria",
        type: "error",
      });
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Adiciona campos básicos
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("whatsapp", formData.whatsapp);
      formDataToSend.append("address[street]", formData.address.street);
      formDataToSend.append("address[number]", formData.address.number);
      formDataToSend.append("address[city]", formData.address.city);
      formDataToSend.append(
        "address[neighborhood]",
        formData.address.neighborhood
      );
      formDataToSend.append("lat", formData.lat);
      formDataToSend.append("long", formData.long);
      formDataToSend.append("instagram", formData.instagram);
      formDataToSend.append("facebook", formData.facebook);
      formDataToSend.append("linkedin", formData.linkedin);
      formDataToSend.append("twitter", formData.twitter);
      formDataToSend.append("tiktok", formData.tiktok);
      formDataToSend.append("site", formData.site);
      formDataToSend.append("video", formData.video);

      // Adiciona categorias e subcategorias como arrays
      formData.category.forEach((cat) => {
        formDataToSend.append("category[]", cat);
      });

      formData.subCategory.forEach((subCat) => {
        formDataToSend.append("subCategory[]", subCat);
      });

      // Adiciona fotos
      formData.photos.forEach((photo, index) => {
        if (photo instanceof File) {
          formDataToSend.append("photos", photo);
        }
      });

      if (id && formData.photos.some((photo) => photo instanceof File)) {
        formDataToSend.append("photosAction", "append");
      }

      if (id) {
        await BusinessService.update(id, formDataToSend);
        setMessage({
          text: "Estabelecimento atualizado com sucesso!",
          type: "success",
        });
      } else {
        await BusinessService.create(formDataToSend);
        setMessage({
          text: "Estabelecimento criado com sucesso!",
          type: "success",
        });
      }

      setTimeout(() => {
        navigate("/dashboard/business");
      }, 2000);
    } catch (error) {
      setMessage({
        text:
          error.response?.data?.message ||
          error.message ||
          "Erro ao salvar estabelecimento",
        type: "error",
      });
    }
  };

  const handleEditorChange = (content) => {
    setFormData((prev) => ({
      ...prev,
      description: content,
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {id ? "Editar Estabelecimento" : "Adicionar Estabelecimento"}
        </h2>
        <button
          onClick={() => navigate("/dashboard/business")}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          Voltar
        </button>
      </div>

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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome*
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
                  Descrição*
                </label>
                <Editor
                  apiKey="41g4akl67ydz2p7djq19czz32fwe3of4dm2jf6uo40qm7jvc"
                  value={formData.description}
                  init={{
                    height: 200,
                    menubar: false,
                    plugins: ["lists", "link", "paste"],
                    toolbar:
                      "undo redo | bold italic underline | bullist numlist | link | alignleft aligncenter alignright alignjustify ",
                  }}
                  onEditorChange={handleEditorChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone*
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="(99) 99999-9999"
                  maxLength={15}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handlePhoneChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="(99) 99999-9999"
                  maxLength={15}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categorias*
                </label>
                <select
                  name="category"
                  multiple
                  value={formData.category}
                  onChange={handleMultipleSelectChange}
                  className="w-full p-2 border border-gray-300 rounded-md h-auto"
                  required
                  size={Math.min(5, allCategories.length + 1)}
                >
                  {allCategories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.category.map((catId) => {
                    const category = allCategories.find((c) => c._id === catId);
                    return category ? (
                      <span
                        key={catId}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                      >
                        {category.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategorias*
                </label>
                <select
                  name="subCategory"
                  multiple
                  value={formData.subCategory}
                  onChange={handleMultipleSelectChange}
                  className="w-full p-2 border border-gray-300 rounded-md h-auto"
                  required
                  size={Math.min(5, allSubCategories.length + 1)}
                  disabled={formData.category.length === 0}
                >
                  {allSubCategories.length === 0 ? (
                    <option value="" disabled>
                      {formData.category.length === 0
                        ? "Selecione categorias primeiro"
                        : "Nenhuma subcategoria disponível"}
                    </option>
                  ) : (
                    allSubCategories.map((subCategory) => (
                      <option key={subCategory._id} value={subCategory._id}>
                        {subCategory.name}
                      </option>
                    ))
                  )}
                </select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.subCategory.map((subCatId) => {
                    const subCategory = allSubCategories.find(
                      (sc) => sc._id === subCatId
                    );
                    return subCategory ? (
                      <span
                        key={subCatId}
                        className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                      >
                        {subCategory.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado*
                </label>
                <select
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Selecione um Estado</option>
                  {cities.map((city) => (
                    <option key={city._id} value={city._id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cidade*
                </label>
                <select
                  name="address.neighborhood"
                  value={formData.address.neighborhood}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                  disabled={!formData.address.city}
                >
                  <option value="">Selecione uma Cidade</option>
                  {neighborhoods.map((neighborhood) => (
                    <option key={neighborhood._id} value={neighborhood._id}>
                      {neighborhood.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rua*
                </label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número*
                </label>
                <input
                  type="text"
                  name="address.number"
                  value={formData.address.number}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lat
                </label>
                <input
                  type="text"
                  name="lat"
                  value={formData.lat}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Long
                </label>
                <input
                  type="text"
                  name="long"
                  value={formData.long}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fotos (Máx. 10)
              </label>
              <div className="flex flex-wrap gap-4 mb-4">
                {previewImages.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img}
                      alt={`Preview ${index}`}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className={`absolute top-0 right-0 ${
                        loadingPhoto ? "bg-gray-500" : "bg-red-500"
                      } text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity`}
                      disabled={loadingPhoto}
                    >
                      {loadingPhoto ? (
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        "×"
                      )}
                    </button>
                  </div>
                ))}
              </div>
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
                multiple
                max="10"
              />
              <p className="mt-1 text-xs text-gray-500">
                PNG, JPG, JPEG até 5MB cada
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram
                </label>
                <input
                  type="text"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Facebook
                </label>
                <input
                  type="text"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Linkedin
                </label>
                <input
                  type="text"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Twitter
                </label>
                <input
                  type="text"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  TikTok
                </label>
                <input
                  type="text"
                  name="tiktok"
                  value={formData.tiktok}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vídeo (URL)
                </label>
                <input
                  type="text"
                  name="video"
                  value={formData.video}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site
                </label>
                <input
                  type="text"
                  name="site"
                  value={formData.site}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {id ? "Atualizar" : "Adicionar"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard/business")}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessForm;
