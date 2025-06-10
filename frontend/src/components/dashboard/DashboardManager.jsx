import React, { useState, useEffect } from "react";
import BusinessService from "../../api/services/business";
import StatsCard from "./StatsCard";
import MonthlyBusinessChart from "./MonthlyBusinessChart";
import { Link } from "react-router-dom";

const DashboardManager = () => {
  const [stats, setStats] = useState({
    businesses: 0,
    cities: 0,
    categories: 0,
  });
  const [recentBusinesses, setRecentBusinesses] = useState([]);
  const [loading, setLoading] = useState({
    stats: true,
    recent: true,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Busca estatísticas
        const statsRes = await BusinessService.getDashboardStats();
        setStats({
          businesses: statsRes.data.data.totalBusinesses,
          cities: statsRes.data.data.totalCities,
          categories: statsRes.data.data.totalCategories,
        });

        const businessesRes = await BusinessService.getRecentBusinesses(6);
        setRecentBusinesses(businessesRes.data.data);

        setLoading({ stats: false, recent: false });
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError(err.message);
        setLoading({ stats: false, recent: false });
      }
    };

    fetchDashboardData();
  }, []);

  if (error)
    return <div className="text-center p-8 text-red-500">Erro: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Seção de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatsCard
          title="Estabelecimentos"
          value={stats.businesses}
          loading={loading.stats}
          icon="🏢"
        />
        <StatsCard
          title="Cidades"
          value={stats.cities}
          loading={loading.stats}
          icon="🌆"
        />
        <StatsCard
          title="Categorias"
          value={stats.categories}
          loading={loading.stats}
          icon="🏷️"
        />
      </div>

      <div className="grid grid-cols-1 gap-8 mb-8">
        <MonthlyBusinessChart />
      </div>

      {/* Seção de Últimos Estabelecimentos */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Últimos Estabelecimentos Cadastrados
        </h2>

        {loading.recent ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : recentBusinesses.length === 0 ? (
          <p className="text-gray-500">
            Nenhum estabelecimento cadastrado recentemente
          </p>
        ) : (
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
                    Data Cadastro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentBusinesses.map((business) => (
                  <tr key={business._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {business.photos && business.photos.length > 0 && (
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={business.photos[0]}
                              alt={business.name}
                            />
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            <Link
                              to={`/business/${business.slug}`}
                              target="_blank"
                              className="uppercase font-semibold text-xs text-[#042f4a] "
                            >
                              {business.name}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {business.category?.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {business.address?.city?.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(business.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/dashboard/business/edit/${business._id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardManager;
