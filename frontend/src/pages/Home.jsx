import React, { useEffect } from "react";
import Hero from "../components/Hero";
import Feature from "../components/Feature";
import Cities from "../components/Cities";
import CTA from "../components/CTA";
import useScrollToTop from "../hooks/useScrollToTop";

const Home = () => {
  useScrollToTop();

  useEffect(() => {
    document.title = "O Vale Online - Home";

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
      <Cities />
      <CTA />
    </>
  );
};

export default Home;
