import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSearch } from "../hooks/useSearch";
import api from "../api/axios";
import Card from "../components/Card";
import useScrollToTop from "../hooks/useScrollToTop";
import VerticalSearchForm from "../components/VerticalSearchForm";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Explore = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: parseInt(searchParams.get("page")) || 1,
    perPage: parseInt(searchParams.get("perPage")) || 9,
    total: 0,
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const {
    searchParams: searchFilters,
    cities,
    neighborhoods,
    categories,
    subCategories,
    isLoading: isLoadingFilters,
    handleSearchChange,
  } = useSearch();

  useScrollToTop([pagination.page, searchParams]);

  useEffect(() => {
    document.title = "O Vale Online - Explore";

    let metaDescription = document.querySelector('meta[name="description"]');

    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }

    metaDescription.content =
      "Descubra os melhores estabelecimentos do Vale do Paraíba! Encontre restaurantes, lojas, serviços e muito mais.";
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowMobileFilters(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams(searchParams.toString());

      if (searchParams.toString() !== queryParams.toString()) {
        queryParams.set("page", "1");
      }

      queryParams.set("perPage", pagination.perPage);
      queryParams.set("random", "true");

      const res = await api.get(`/businesses/search?${queryParams.toString()}`);

      setResults(res.data.data);
      setPagination((prev) => ({
        ...prev,
        page: parseInt(queryParams.get("page")) || 1,
        total: res.data.pagination.total,
        totalPages: res.data.pagination.totalPages,
      }));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Ocorreu um erro ao carregar os resultados"
      );
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [searchParams.toString(), pagination.perPage]);

  const handlePageChange = (newPage) => {
    const newPagination = { ...pagination, page: newPage };
    setPagination(newPagination);

    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    navigate(`?${params.toString()}`, { replace: true });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePerPageChange = (value) => {
    const newPerPage = parseInt(value);
    const newPagination = {
      ...pagination,
      perPage: newPerPage,
      page: 1,
    };
    setPagination(newPagination);

    const params = new URLSearchParams(searchParams);
    params.set("perPage", newPerPage);
    params.set("page", "1");
    navigate(`?${params.toString()}`, { replace: true });
  };

  const handleSearchSubmit = (params) => {
    const newSearchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value) newSearchParams.set(key, value);
    });

    newSearchParams.set("page", "1");
    newSearchParams.set("perPage", pagination.perPage.toString());

    navigate(`?${newSearchParams.toString()}`);

    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));

    // Fecha os filtros em mobile após aplicar
    if (window.innerWidth < 1024) {
      setShowMobileFilters(false);
    }
  };

  const totalPages = Math.ceil(pagination.total / pagination.perPage);

  if (error) return <div className="p-4 mt-24 text-red-500">{error}</div>;

  return (
    <div className="w-full mt-16 md:mt-24 p-4 flex flex-col lg:flex-row gap-8 px-4">
      {/* Botão Filtrar (apenas mobile) */}
      <button
        onClick={() => setShowMobileFilters(!showMobileFilters)}
        className="lg:hidden bg-[#042f4a] text-white py-2 px-4 rounded-md mb-4 flex items-center justify-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
        {showMobileFilters ? "Ocultar Filtros" : "Filtrar"}
      </button>

      {/* Sidebar com SearchForm */}
      <aside
        className={`w-full lg:w-80 ${
          !showMobileFilters ? "hidden lg:block" : "block"
        }`}
      >
        <VerticalSearchForm
          onSubmit={() => {
            if (window.innerWidth < 1024) {
              setShowMobileFilters(false);
            }
          }}
        />
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1">
        <h1 className="text-lg font-semibold mb-6">
          {loading ? (
            <Skeleton width={250} height={32} />
          ) : (
            <>
              Resultados{" "}
              <span className="text-gray-500">({pagination.total})</span>
            </>
          )}
        </h1>

        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Seletor de itens por página */}
          {loading ? (
            <Skeleton width={150} height={32} />
          ) : (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <label htmlFor="perPage" className="whitespace-nowrap">
                Exibir:
              </label>
              <select
                id="perPage"
                value={pagination.perPage}
                onChange={(e) => handlePerPageChange(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="9">9 por página</option>
                <option value="12">12 por página</option>
                <option value="24">24 por página</option>
              </select>
            </div>
          )}

          {/* Info da página atual */}
          {loading ? (
            <Skeleton width={120} height={24} />
          ) : (
            <div className="text-sm text-gray-500">
              Página{" "}
              <span className="font-medium text-gray-800">
                {pagination.page}
              </span>{" "}
              de <span className="font-medium text-gray-800">{totalPages}</span>
            </div>
          )}
        </div>

        {/* Resultados */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: pagination.perPage }).map((_, index) => (
              <Card key={`skeleton-${index}`} loading={true} />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Nenhum estabelecimento encontrado com os filtros atuais
            </p>
            <button
              onClick={() => handleSearchSubmit({})}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {results.map((business) => (
                <Card key={business._id} business={business} />
              ))}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition"
                >
                  Anterior
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-4 py-2 rounded-lg transition ${
                        pagination.page === pageNum
                          ? "bg-black text-white"
                          : "border border-gray-300 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition"
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Explore;
