import React, { useState, useEffect } from "react";
import Title from "./Title";
import BusinessService from "../api/services/business";
import Card from "./Card";

const Feature = ({ limit = 8, fetchFunction = BusinessService.getLatest }) => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchFunction(limit);
        setBusinesses(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [limit, fetchFunction]);

  if (error)
    return <div className="text-center p-8 text-red-500">Erro: {error}</div>;

  return (
    <div className="flex flex-col items-center px-1 pb-12 md:px-24 pt-20 md:mb-20 bg-slate-50 md:py-20">
      <div className="px-4">
        <Title
          title="Últimos estabelecimentos cadastrados"
          subTitle="Descubra as empresas cuidadosamente selecionadas para atender às suas necessidades!"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 w-full">
        {loading
          ? // Exibe skeletons enquanto carrega
            Array(limit)
              .fill()
              .map((_, index) => (
                <Card key={`skeleton-${index}`} loading={true} />
              ))
          : // Exibe os cards reais quando os dados estão prontos
            businesses.map((business) => (
              <Card key={business._id} business={business} />
            ))}
      </div>
    </div>
  );
};

export default Feature;
