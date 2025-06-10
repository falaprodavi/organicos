import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import AuthService from "../../api/auth";
import {
  MdSpaceDashboard,
  MdAddBusiness,
  MdCategory,
  MdOutlineCategory,
  MdMap,
  MdMyLocation,
  MdArrowForwardIos,
  MdArrowBackIosNew,
} from "react-icons/md";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthService.logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-blue-800 text-white transition-all duration-300`}
      >
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold">Dashboard</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md hover:bg-blue-700"
          >
            {sidebarOpen ? <MdArrowBackIosNew /> : <MdArrowForwardIos />}
          </button>
        </div>
        <nav className="mt-6">
          <Link
            to="/dashboard"
            className="flex items-center p-3 hover:bg-blue-700 rounded-md"
          >
            <span>
              <MdSpaceDashboard />
            </span>
            {sidebarOpen && <span className="ml-3">Início</span>}
          </Link>
          <Link
            to="/dashboard/business"
            className="flex items-center p-3 hover:bg-blue-700 rounded-md"
          >
            <span>
              <MdAddBusiness />
            </span>
            {sidebarOpen && <span className="ml-3">Estabelecimentos</span>}
          </Link>
          <Link
            to="/dashboard/cities"
            className="flex items-center p-3 hover:bg-blue-700 rounded-md"
          >
            <span>
              <MdMap />
            </span>
            {sidebarOpen && <span className="ml-3">Cidades</span>}
          </Link>
          <Link
            to="/dashboard/neighborhoods"
            className="flex items-center p-3 hover:bg-blue-700 rounded-md"
          >
            <span>
              <MdMyLocation />
            </span>
            {sidebarOpen && <span className="ml-3">Bairros</span>}
          </Link>
          <Link
            to="/dashboard/categories"
            className="flex items-center p-3 hover:bg-blue-700 rounded-md"
          >
            <span>
              <MdCategory />
            </span>
            {sidebarOpen && <span className="ml-3">Categorias</span>}
          </Link>
          <Link
            to="/dashboard/subcategories"
            className="flex items-center p-3 hover:bg-blue-700 rounded-md"
          >
            <span>
              <MdOutlineCategory />
            </span>
            {sidebarOpen && <span className="ml-3">Sub Categorias</span>}
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center p-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Painel de Controle
            </h2>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Sair
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
