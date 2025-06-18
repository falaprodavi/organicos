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
    <>
      {/* Título em destaque */}
      <div className="w-full px-4 py-12 bg-[#EDDD5E]">
        <h1 className="text-2xl md:text-4xl text-center text-[#4F583B] max-w-screen-xl mx-auto">
          Últimas Empresas Naturais e Orgânicas Cadastradas
        </h1>
      </div>

      {/* Cards */}
      <div className="w-full bg-slate-50">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-8 md:pt-20 md:pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading
              ? Array(limit)
                  .fill()
                  .map((_, index) => (
                    <Card key={`skeleton-${index}`} loading={true} />
                  ))
              : businesses.map((business) => (
                  <Card key={business._id} business={business} />
                ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Feature;
