import React, { useEffect } from "react";
import Hero from "../components/Hero";
import Feature from "../components/Feature";
import CTA from "../components/CTA";
import useScrollToTop from "../hooks/useScrollToTop";
import CategoriesHome from "../components/CategoriesHome";

const Home = () => {
  useScrollToTop();

  useEffect(() => {
    document.title = "Orgânicos - Home";

    let metaDescription = document.querySelector('meta[name="description"]');

    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }

    metaDescription.content =
      "Descubra os melhores estabelecimentos do Vale! Encontre restaurantes, lojas, serviços e muito mais.";
  }, []);

  return (
    <>
      <Hero />
      <Feature />

      <CategoriesHome />
      <CTA />
    </>
  );
};

export default Home;
