import { useState, useEffect } from "react";
import BusinessService from "../../api/services/business";
import { Link } from "react-router-dom";
import useScrollToTop from "../../hooks/useScrollToTop";

const BusinessesList = () => {
  useScrollToTop();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const businessesData = await BusinessService.getAll();
      // Ordena por data de criação (createdAt) - do mais recente para o mais antigo
      const sortedBusinesses = businessesData.data.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setBusinesses(sortedBusinesses);
      setLoading(false);
    } catch (error) {
      setMessage({ text: "Erro ao carregar dados", type: "error" });
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Tem certeza que deseja excluir este estabelecimento?")
    ) {
      try {
        await BusinessService.delete(id);
        setMessage({
          text: "Estabelecimento excluído com sucesso!",
          type: "success",
        });
        await fetchData();
      } catch (error) {
        setMessage({
          text:
            error.response?.data?.message || "Erro ao excluir estabelecimento",
          type: "error",
        });
      }
    }
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
        <h2 className="text-2xl font-bold">Gerenciar Estabelecimentos</h2>
        <Link
          to="/dashboard/business/add"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Adicionar Estabelecimento
        </Link>
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
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de Cadastro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {businesses.map((business) => (
                <tr key={business._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {business.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {business.category?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {business.address?.city?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(business.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <Link
                      to={`/dashboard/business/edit/${business._id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(business._id)}
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

export default BusinessesList;
