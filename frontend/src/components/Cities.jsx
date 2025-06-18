import React from "react";
import { assets } from "../assets/assets";
import Title from "./Title";
import City from "./City";

const Cities = () => {
  return (
    <div className="mt-8 flex flex-col items-center px-6 md:px-16 lg:px-24 xl:px-32 mb-12">
      <div className="flex flex-col md:flex-row items-center justify-between w-full">
        <Title
          align="left"
          title="Estados"
          subTitle="Temos novidades nessas por Estados! Confira e encontre as melhores empresas de Produtos Naturais!"
        />
        <button className="mb-12 group flex items-center font-medium">
          Ver Estados
          <img
            src={assets.arrowIcon}
            alt="icon"
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>

      <City />
    </div>
  );
};

export default Cities;
