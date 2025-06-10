import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import AuthService from "../api/auth";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Explore", path: "/explore" },
  { name: "Quem Somos", path: "/quem-somos" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const user = await AuthService.getCurrentUser();
      setCurrentUser(user);

      if (user) {
        const adminStatus = await AuthService.isAdmin();
        setIsAdmin(adminStatus);
      }
    };

    checkAuth();
  }, [location.pathname]);

  useEffect(() => {
    const isHome = location.pathname === "/";
    setIsScrolled(!isHome);

    if (isHome) {
      const handleScroll = () => setIsScrolled(window.scrollY > 10);
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    AuthService.logout();
    setCurrentUser(null);
    setIsUserMenuOpen(false);
    navigate("/");
  };

  const navItemClasses = (isScrolled) =>
    `group flex flex-col gap-0.5 ${
      isScrolled ? "text-gray-700" : "text-white"
    }`;

  const underlineClasses = (isScrolled) =>
    `${
      isScrolled ? "bg-gray-700" : "bg-white"
    } h-0.5 w-0 group-hover:w-full transition-all duration-300`;

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${
        isScrolled
          ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4"
          : "py-4 md:py-6"
      }`}
    >
      <Link to="/">
        <img
          src={assets.logoguia}
          alt="logo"
          className={`h-9 ${isScrolled && "invert opacity-80"}`}
        />
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-4 lg:gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={navItemClasses(isScrolled)}
          >
            {link.name}
            <div className={underlineClasses(isScrolled)} />
          </Link>
        ))}
      </div>

      {/* Desktop Right Section - Sempre visível */}
      <div className="hidden md:flex items-center gap-4">
        <Link to="https://wa.me/5511971622876?text=Olá,%20gostaria%20de%20cadastrar%20minha%20empresa">
          <button className="bg-[#042f4a] text-white px-4 py-2.5 rounded-full">
            Cadastre seu estabelecimento
          </button>
        </Link>

        {/* Mostrar apenas se o usuário estiver logado */}
        {currentUser ? (
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {currentUser.photo ? (
                  <img
                    src={currentUser.photo}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-medium text-gray-600">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <span className={isScrolled ? "text-gray-700" : "text-white"}>
                {currentUser.name.split(" ")[0]}
              </span>
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <Link
                  to="/minha-conta"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  Minha Conta
                </Link>
                <Link
                  to="/favorites"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  Meus Favoritos
                </Link>
                <Link
                  to="/minhas-empresas"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  Minhas Empresas
                </Link>
                {isAdmin && (
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Painel Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login">
            <button
              className={`border px-4 py-1 text-sm font-light rounded-full ${
                isScrolled ? "text-black" : "text-white"
              }`}
            >
              Login
            </button>
          </Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="flex items-center gap-3 md:hidden"
        onClick={() => setIsMenuOpen(true)}
      >
        <img
          src={assets.menuIcon}
          alt="menu"
          className={`${isScrolled && "invert"} h-4`}
        />
      </button>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-white flex flex-col items-center justify-center gap-6 font-medium text-gray-800 transition-transform duration-500 md:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="absolute top-4 right-4"
          onClick={() => setIsMenuOpen(false)}
        >
          <img src={assets.closeIcon} alt="close-menu" className="h-6" />
        </button>

        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className="text-base"
            onClick={() => setIsMenuOpen(false)}
          >
            {link.name}
          </Link>
        ))}

        <Link
          to="/cadastrar-estabelecimento"
          className="text-base"
          onClick={() => setIsMenuOpen(false)}
        >
          Cadastre seu estabelecimento
        </Link>

        {currentUser ? (
          <>
            <Link
              to="/minha-conta"
              className="text-base"
              onClick={() => setIsMenuOpen(false)}
            >
              Minha Conta
            </Link>
            <Link
              to="/favorites"
              className="text-base"
              onClick={() => setIsMenuOpen(false)}
            >
              Meus Favoritos
            </Link>
            <Link
              to="/minhas-empresas"
              className="text-base"
              onClick={() => setIsMenuOpen(false)}
            >
              Minhas Empresas
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                Painel Admin
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="bg-black text-white px-8 py-2.5 rounded-full"
            >
              Sair
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="text-base"
            onClick={() => setIsMenuOpen(false)}
          >
            <button className="bg-black text-white px-8 py-2.5 rounded-full">
              Login
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
