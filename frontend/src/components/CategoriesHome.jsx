import { assets } from "../assets/assets";
import Title from "./Title";
import CardCategory from "./CardCategory";

const CategoriesHome = () => {
  return (
    <section className="mt-8">
  <div className="max-w-screen-xl px-4 sm:px-6 lg:px-8 mx-auto mb-12">
    {/* Header */}
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
      <Title
        align="left"
        title="Categorias"
        subTitle="Temos novidades nessas por Estados! Confira e encontre as melhores empresas de Produtos Naturais!"
      />

      <button className="flex items-center font-medium group hover:text-primary transition-colors text-sm sm:text-base">
        Ver Categorias
        <img
          src={assets.arrowIcon}
          alt=""
          className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
        />
      </button>
    </div>

    {/* Cards */}
    <div className="relative w-full">
      <CardCategory />
    </div>
  </div>
</section>
  );
};

export default CategoriesHome;
