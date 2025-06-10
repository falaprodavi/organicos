// src/hooks/useSearch.js
import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../api/axios"; // Ajuste o caminho conforme sua estrutura

export const useSearch = () => {
  const [searchParams, setSearchParams] = useState({
    name: "",
    city: "",
    neighborhood: "",
    category: "",
    subcategory: "",
  });

  const [cities, setCities] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Carrega dados iniciais (cidades e categorias)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const [citiesRes, categoriesRes] = await Promise.all([
          api.get("/cities"),
          api.get("/categories"),
        ]);

        setCities(citiesRes.data);
        setCategories(categoriesRes.data);
        updateSearchParamsFromURL();
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Atualiza os parâmetros quando a URL muda
  const updateSearchParamsFromURL = useCallback(() => {
    const params = new URLSearchParams(location.search);
    const newParams = {
      name: params.get("name") || "",
      city: params.get("city") || "",
      neighborhood: params.get("neighborhood") || "",
      category: params.get("category") || "",
      subcategory: params.get("subcategory") || "",
    };

    setSearchParams(newParams);

    // Carrega dados dependentes
    if (newParams.city) loadNeighborhoods(newParams.city);
    if (newParams.category) loadSubCategories(newParams.category);
  }, [location.search]);

  useEffect(() => {
    updateSearchParamsFromURL();
  }, [updateSearchParamsFromURL]);

  // Carrega bairros por slug da cidade
  const loadNeighborhoods = async (citySlug) => {
    try {
      const res = await api.get(`/neighborhoods?city=${citySlug}`);
      setNeighborhoods(res.data);
    } catch (error) {
      console.error("Error loading neighborhoods:", error);
      setNeighborhoods([]);
    }
  };

  // Carrega subcategorias por slug da categoria
  const loadSubCategories = async (categorySlug) => {
    try {
      const res = await api.get(`/subcategories?category=${categorySlug}`);
      setSubCategories(res.data);
    } catch (error) {
      console.error("Error loading subcategories:", error);
      setSubCategories([]);
    }
  };

  // Atualiza os parâmetros de busca
  const handleSearchChange = async (e) => {
    const { name, value } = e.target;
    const newParams = { ...searchParams, [name]: value };

    // Reset de campos dependentes
    if (name === "city") {
      newParams.neighborhood = "";
      setNeighborhoods([]);
    }

    if (name === "category") {
      newParams.subcategory = "";
      setSubCategories([]);
    }

    setSearchParams(newParams);

    // Carrega dados dependentes
    if (name === "city" && value) {
      await loadNeighborhoods(value);
    }

    if (name === "category" && value) {
      await loadSubCategories(value);
    }
  };

  // Executa a busca atualizando a URL
  const handleSearchSubmit = useCallback(
    (e) => {
      e?.preventDefault?.();

      const queryParams = new URLSearchParams();

      // Adiciona apenas parâmetros com valor
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value) queryParams.set(key, value);
      });

      // Mantém a consistência com a página Explore
      queryParams.set("page", "1");

      navigate(`/explore?${queryParams.toString()}`);
    },
    [searchParams, navigate]
  );

  return {
    searchParams,
    cities,
    neighborhoods,
    categories,
    subCategories,
    isLoading,
    handleSearchChange,
    handleSearchSubmit,
  };
};
