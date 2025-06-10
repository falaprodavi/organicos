import React from "react";
import { Link } from "react-router-dom";
import useApi from "../hooks/useApi";
import CityService from "../api/services/city";
import { slugify } from "../utils/helpers";

const City = () => {
  const { data, loading, error } = useApi(CityService.getPopularCities);

  if (loading)
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

  if (error) return <div className="text-red-500 p-4">Erro: {error}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {data.map((city) => (
        <Link
          key={city._id}
          to={`/explore?city=${slugify(city.name)}`}
          className="block group transition-transform hover:scale-[1.02]"
        >
          <div className="bg-white rounded-2xl shadow-md hover:shadow-lg overflow-hidden relative flex flex-col h-full transition-all">
            <div className="relative">
              <img
                src={city.image}
                alt={city.name}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-2xl" />

              <span className="absolute top-3 left-3 bg-white/80 backdrop-blur-md text-gray-700 font-light text-xs px-3 py-1 rounded-full shadow-sm group-hover:bg-opacity-90 transition-all">
                {city.totalBusinesses} estabelecimentos
              </span>
            </div>

            <div className="p-4 flex-grow flex items-end">
              <h3 className="font-semibold text-lg text-gray-800">
                {city.name}
              </h3>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default City;
