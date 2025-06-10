import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import useApi from "../hooks/useApi";
import CityService from "../api/services/city";
import { slugify } from "../utils/helpers";
import CategoryService from "../api/services/category";

const Footer = () => {
  const { data: cities } = useApi(CityService.getPopularCities);
  const [allCategories, setAllCategories] = useState([]);
  const [randomCategories, setRandomCategories] = useState([]);

  // Carrega todas as categorias
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await CategoryService.getAll();
        setAllCategories(response);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Seleciona categorias aleatórias quando allCategories é atualizado
  useEffect(() => {
    if (allCategories.length > 0) {
      selectRandomCategories();
    }
  }, [allCategories]);

  // Função para selecionar 5 categorias aleatórias
  const selectRandomCategories = () => {
    // Cria uma cópia do array para não modificar o original
    const shuffled = [...allCategories];

    // Algoritmo Fisher-Yates para embaralhar
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Pega as primeiras 5 categorias do array embaralhado
    setRandomCategories(shuffled.slice(0, 5));
  };

  // Rotação automática a cada 30 segundos (opcional)
  useEffect(() => {
    if (allCategories.length > 0) {
      const interval = setInterval(selectRandomCategories, 10000);
      return () => clearInterval(interval);
    }
  }, [allCategories]);

  const legalLinks = [
    { label: "Privacidade", href: "#" },
    { label: "Termos", href: "#" },
    { label: "Sitemap", href: "#" },
  ];

  const socialIcons = [
    {
      icon:
        "M7.75 2A5.75 5.75 0 002 7.75v8.5A5.75 5.75 0 007.75 22h8.5A5.75 5.75 0 0022 16.25v-8.5A5.75 5.75 0 0016.25 2h-8.5zM4.5 7.75A3.25 3.25 0 017.75 4.5h8.5a3.25 3.25 0 013.25 3.25v8.5a3.25 3.25 0 01-3.25 3.25h-8.5a3.25 3.25 0 01-3.25-3.25v-8.5zm9.5 1a4 4 0 11-4 4 4 4 0 014-4zm0 1.5a2.5 2.5 0 102.5 2.5 2.5 2.5 0 00-2.5-2.5zm3.5-.75a.75.75 0 11.75-.75.75.75 0 01-.75.75z",
    },
    {
      icon:
        "M13.5 9H15V6.5h-1.5c-1.933 0-3.5 1.567-3.5 3.5v1.5H8v3h2.5V21h3v-7.5H16l.5-3h-3z",
    },
    {
      icon:
        "M22 5.92a8.2 8.2 0 01-2.36.65A4.1 4.1 0 0021.4 4a8.27 8.27 0 01-2.6 1A4.14 4.14 0 0016 4a4.15 4.15 0 00-4.15 4.15c0 .32.04.64.1.94a11.75 11.75 0 01-8.52-4.32 4.14 4.14 0 001.29 5.54A4.1 4.1 0 013 10v.05a4.15 4.15 0 003.33 4.07 4.12 4.12 0 01-1.87.07 4.16 4.16 0 003.88 2.89A8.33 8.33 0 012 19.56a11.72 11.72 0 006.29 1.84c7.55 0 11.68-6.25 11.68-11.67 0-.18 0-.35-.01-.53A8.18 8.18 0 0022 5.92z",
    },
    {
      icon:
        "M4.98 3.5C3.88 3.5 3 4.38 3 5.48c0 1.1.88 1.98 1.98 1.98h.02c1.1 0 1.98-.88 1.98-1.98C6.98 4.38 6.1 3.5 4.98 3.5zM3 8.75h3.96V21H3V8.75zm6.25 0h3.8v1.68h.05c.53-.98 1.82-2.02 3.75-2.02 4.01 0 4.75 2.64 4.75 6.07V21H17v-5.63c0-1.34-.03-3.07-1.88-3.07-1.88 0-2.17 1.47-2.17 2.98V21H9.25V8.75z",
    },
  ];

  return (
    <div className="text-gray-500/80 mt-12 pt-8 px-6 md:px-16 lg:px-24 xl:px-32">
      <div className="flex flex-wrap justify-between gap-12 md:gap-6">
        <div className="max-w-80">
          <img src={assets.badgeIcon} alt="logo" />
          <p className="text-sm mt-2">
            Somos uma plataforma especializada na divulgação dos melhores
            estabelecimentos do Vale do Paraíba . Nosso sistema de busca permite
            que você encontre empresas de forma rápida e intuitiva, utilizando
            filtros como cidade, bairro, categoria e subcategoria.
          </p>
          <div className="flex items-center gap-3 mt-4">
            {socialIcons.map((social, index) => (
              <svg
                key={index}
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d={social.icon} />
              </svg>
            ))}
          </div>
        </div>

        {/* Seção de Cidades */}
        <div>
          <h3 className="text-lg text-gray-800">CIDADES</h3>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {cities?.slice(0, 5).map((city) => (
              <li key={city._id}>
                <Link
                  to={`/explore?city=${slugify(city.name)}`}
                  className="hover:text-gray-800 transition-colors"
                >
                  {city.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Seção de Categorias Aleatórias */}
        <div>
          <div className="flex justify-between items-center">
            <h3 className="text-lg text-gray-800 mr-3"> CATEGORIAS </h3>
            <button
              onClick={selectRandomCategories}
              className="text-gray-500 hover:text-gray-800 transition-colors"
              title="Mostrar outras categorias"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {randomCategories.map((category) => (
              <li key={category._id}>
                <Link
                  to={`/explore?category=${slugify(category.name)}`}
                  className="hover:text-gray-800 transition-colors"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="max-w-80">
          <h3 className="text-lg text-gray-800">FIQUE ATUALIZADO</h3>
          <p className="mt-3 text-sm">
            Confira as novidades do Vale do Paraíba!
          </p>
          <div className="flex items-center mt-4">
            <input
              type="text"
              className="bg-white rounded-l border border-gray-300 h-9 px-3 outline-none flex-grow"
              placeholder="Digite seu e-mail..."
            />
            <button className="flex items-center justify-center bg-black h-9 w-9 aspect-square rounded-r">
              <svg
                className="w-4 h-4 text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 12H5m14 0-4 4m4-4-4-4"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <hr className="border-gray-300 mt-8" />

      <div className="flex flex-col md:flex-row gap-2 items-center justify-between py-5">
        <p>© {new Date().getFullYear()} Todos direitos Reservados.</p>
        <ul className="flex items-center gap-4">
          {legalLinks.map((link) => (
            <li key={link.label}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Footer;
