import React, { useEffect } from "react";
import useScrollToTop from "../hooks/useScrollToTop";

const About = () => {
  useScrollToTop();

  useEffect(() => {
    document.title = "O Vale Online - Quem Somos";

    let metaDescription = document.querySelector('meta[name="description"]');

    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }

    metaDescription.content =
      "Somos uma plataforma especializada na divulgação dos melhores estabelecimentos do Vale do Paraíba";
  }, []);
  return (
    <div className="container mx-auto px-4 py-12 mt-16 md:mt-24">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden md:flex md:items-center md:space-x-8">
        {/* Imagem ilustrativa */}
        <div className="w-full md:w-1/2">
          <img
            src="https://res.cloudinary.com/dgqhiieda/image/upload/f_webp/q_auto/v1748545901/vale_assets/guiadovale_oxs8pp.png"
            alt="Quem Somos"
            className="w-full h-auto max-h-[1200px] object-contain md:object-cover md:h-full"
          />
        </div>

        {/* Texto */}
        <div className="p-8 md:w-1/2">
          <h1 className="text-3xl font-bold text-[#042f4a] mb-4">Quem Somos</h1>

          <p className="text-gray-600 mb-4">
            Somos a plataforma de referência para descobrir os melhores
            estabelecimentos do{" "}
            <span className="font-semibold text-[#042f4a]">
              Vale do Paraíba
            </span>
            . Nosso objetivo é conectar você aos negócios que merecem destaque,
            com um sistema de busca{" "}
            <span className="font-semibold text-[#042f4a]">
              rápido, intuitivo e personalizável
            </span>
            .
          </p>

          <h2 className="text-xl font-semibold text-[#042f4a] mb-3 mt-6">
            Como Funciona?
          </h2>
          <p className="text-gray-600 mb-4">
            Encontre exatamente o que procura utilizando filtros como{" "}
            <span className="font-semibold text-[#042f4a]">
              cidade, bairro, categoria e subcategoria
            </span>
            . Queremos que sua experiência seja{" "}
            <span className="font-semibold text-[#042f4a]">
              ágil, prática e satisfatória
            </span>
            .
          </p>

          <h2 className="text-xl font-semibold text-[#042f4a] mb-3 mt-6">
            Nossos Valores
          </h2>
          <ul className="text-gray-600 list-disc pl-5 mb-4 space-y-2">
            <li>
              <span className="font-semibold text-[#042f4a]">Igualdade:</span>{" "}
              Todos os estabelecimentos têm a mesma visibilidade – não há
              priorização, os resultados são randômicos.
            </li>
            <li>
              <span className="font-semibold text-[#042f4a]">
                Transparência:
              </span>{" "}
              Planos únicos e justos, sem surpresas.
            </li>
            <li>
              <span className="font-semibold text-[#042f4a]">Qualidade:</span>{" "}
              Informações verificadas e atualizadas para você tomar a melhor
              decisão.
            </li>
            <li>
              <span className="font-semibold text-[#042f4a]">
                Acessibilidade:
              </span>{" "}
              Interface simples e eficiente, pensada para todos.
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-[#042f4a] mb-3 mt-6">
            Nosso Propósito
          </h2>
          <p className="text-gray-600 mb-4">
            Acreditamos no potencial do{" "}
            <span className="font-semibold text-[#042f4a]">
              Vale do Paraíba
            </span>{" "}
            e queremos impulsionar seu crescimento econômico através de{" "}
            <span className="font-semibold text-[#042f4a]">
              tecnologia, colaboração e conexões que realmente importam
            </span>
            .
          </p>

          <p className="text-gray-600 font-medium mt-6">
            Junte-se a nós e descubra o melhor da região!
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
