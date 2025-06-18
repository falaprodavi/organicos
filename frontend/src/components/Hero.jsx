import React, { useState, useEffect } from "react";
import { useSearch } from "../hooks/useSearch";
import HorizontalSearchForm from "../components/HorizontalSearchForm";

const images = [
  "https://res.cloudinary.com/dgqhiieda/image/upload/v1750176491/hero_ihydoz.jpg",
  "https://images.pexels.com/photos/5205672/pexels-photo-5205672.jpeg",
  "https://static1.minhavida.com.br/ingredients/46/94/23/88/cogumelo-juba-de-leao-preso-em-uma-arvore-orig-1.jpg",
];

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [loaded, setLoaded] = useState(() => images.map((_, i) => i === 0)); // só a primeira carregada

  useEffect(() => {
    const interval = setInterval(() => {
      const next = (currentImage + 1) % images.length;
      setCurrentImage(next);

      // Marca a próxima como "carregada"
      setLoaded((prev) => {
        const updated = [...prev];
        updated[next] = true;
        return updated;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [currentImage]);

  const handleDotClick = (index) => {
    setCurrentImage(index);
    setLoaded((prev) => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
  };

  const {
    searchParams,
    cities,
    neighborhoods,
    categories,
    subCategories,
    isLoading,
    handleSearchChange,
    handleSearchSubmit,
  } = useSearch();

  return (
    <div className="relative min-h-[70vh] md:min-h-[85vh] flex flex-col items-center justify-center px-4 md:px-8 py-16 text-white overflow-hidden">
      {/* Slide de imagens com fade + lazyload */}
      {images.map((url, index) =>
        loaded[index] ? (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              index === currentImage ? "opacity-100 z-0" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${url})` }}
          />
        ) : null
      )}

      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>

      {/* Conteúdo */}
      <div className="relative z-20 w-full max-w-6xl text-center">
        <span className="inline-block text-xs md:text-sm bg-[#4F583B] px-3.5 py-1 rounded-full mb-4">
          As melhores Empresas de Produtos Naturais e Orgânicos
        </span>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Encontre tudo que deseja!
        </h1>
        <div className="md:w-full md:flex justify-center">
          <HorizontalSearchForm
            searchParams={searchParams}
            cities={cities}
            neighborhoods={neighborhoods}
            categories={categories}
            subCategories={subCategories}
            onSearchChange={handleSearchChange}
            onSearchSubmit={handleSearchSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Bolinhas */}
      <div className="absolute bottom-6 flex gap-2 z-30">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentImage ? "bg-white" : "bg-white/50"
            } transition-all duration-300`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
