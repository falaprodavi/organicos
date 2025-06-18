import React from "react";
import { Link } from "react-router-dom";
import useApi from "../hooks/useApi";
import CategoryService from "../api/services/category";
import { slugify } from "../utils/helpers";

const CardCategory = () => {
  const { data = [], loading, error } = useApi(CategoryService.getAll);

  console.log("Dados para renderização:", data); // Debug adicional

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="w-full min-w-[250px] h-64 bg-gray-200 rounded-2xl animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">Erro: {error.message}</div>;
  }

  // Verificação mais robusta
  if (!Array.isArray(data)) {
    console.error("Dados inválidos - não é array:", data);
    return <div className="text-yellow-600 p-4">Formato de dados inválido</div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {data.map((category) => {
        console.log("Renderizando categoria:", category); // Debug para cada item
        return (
          <Link
            key={category._id}
            to={`/explore?category=${slugify(category.name)}`}
            className="block group transition-transform hover:scale-[1.02]"
          >
            <div className="bg-white rounded-2xl shadow-md hover:shadow-lg overflow-hidden relative flex flex-col h-full transition-all">
              <div className="relative">
                <img
                  src={category.icon}
                  alt={category.name}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105 "
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300";
                    console.error("Erro ao carregar imagem:", category.icon);
                  }}
                />
                <div className="absolute inset-0 bg-black/0 transition-all duration-300 rounded-2xl" />
              </div>

              <div className="p-4 flex-grow flex items-end">
                <h3 className="text-sm text-gray-800">{category.name}</h3>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default CardCategory;
