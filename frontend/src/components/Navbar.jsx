import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import AuthService from "../api/auth";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Empresas Naturais e Orgânicas", path: "/explore" },
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
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg"
          : "text-white"
      }`}
    >
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={assets.logo}
            alt="logo"
            className={`h-9 transition-all duration-300 ${
              isScrolled ? "invert opacity-80" : ""
            }`}
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

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="https://wa.me/5511971622876?text=Olá,%20gostaria%20de%20cadastrar%20minha%20empresa">
            <button className="bg-[#4F583B] text-white text-sm px-4 py-2 rounded-full transition-colors hover:bg-[#367f00]">
              Cadastre sua Empresa
            </button>
          </Link>

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
                <span
                  className={`text-sm font-medium ${
                    isScrolled ? "text-gray-700" : "text-white"
                  }`}
                >
                  {currentUser.name.split(" ")[0]}
                </span>
              </button>

              {/* User Menu */}
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
                className={`border px-4 py-2 text-sm rounded-full transition-colors ${
                  isScrolled
                    ? "text-black border-gray-300"
                    : "text-white border-white"
                }`}
              >
                Login
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="flex items-center gap-2 md:hidden"
          onClick={() => setIsMenuOpen(true)}
        >
          <img
            src={assets.menuIcon}
            alt="menu"
            className={`h-4 transition-all duration-300 ${
              isScrolled ? "invert" : ""
            }`}
          />
        </button>
      </div>

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
            className="text-lg"
            onClick={() => setIsMenuOpen(false)}
          >
            {link.name}
          </Link>
        ))}

        <Link
          to="/cadastrar-estabelecimento"
          className="text-lg"
          onClick={() => setIsMenuOpen(false)}
        >
          Cadastre seu estabelecimento
        </Link>

        {currentUser ? (
          <>
            <Link
              to="/minha-conta"
              className="text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Minha Conta
            </Link>
            <Link
              to="/favorites"
              className="text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Meus Favoritos
            </Link>
            <Link
              to="/minhas-empresas"
              className="text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Minhas Empresas
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="text-lg"
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
            className="text-lg"
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
