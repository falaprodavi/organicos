import React from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation, Navigate, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Explore from "./pages/Explore";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProtectedRoute from "./components/dashboard/ProtectedRoute";
import Layout from "./components/dashboard/Layout";
import DashboardPage from "./pages/dashboard/DashboardPage";
import CitiesPage from "./pages/dashboard/CitiesPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CategoriesPage from "./pages/dashboard/CategoriesPage";
import NeighborhoodsPage from "./pages/dashboard/NeighborhoodsPage";
import SubCategoriesPage from "./pages/dashboard/SubCategoriesPage";
import BusinessPage from "./pages/dashboard/BusinessPage";
import BusinessDetails from "./pages/BusinessDetails";
import UserFavorites from "./pages/UserFavorites";
import Unauthorized from "./pages/Unauthorized";
import About from "./pages/About";
import BusinessesList from "./pages/dashboard/BusinessesList";
import BusinessForm from "./pages/dashboard/BusinessForm";

function MainLayout() {
  const location = useLocation();
  const isOwnerPath = location.pathname.includes("owner");

  return (
    <div>
      {!isOwnerPath && <Navbar />}
      <div className="min-h-[70vh]">
        <Outlet /> {/* Isso renderiza as rotas filhas */}
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        {/* Rotas com layout principal (Navbar + Footer) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/quem-somos" element={<About />} />
          <Route path="/business/:slug" element={<BusinessDetails />} />
        </Route>

        {/* Rotas protegidas para admin com layout de dashboard */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            {/* <Route path="/dashboard/business" element={<BusinessPage />} /> */}
            <Route path="/dashboard/cities" element={<CitiesPage />} />
            <Route path="/dashboard/categories" element={<CategoriesPage />} />
            <Route path="/dashboard/business" element={<BusinessesList />} />
            <Route
              path="/dashboard/business/add"
              element={<BusinessForm />}
            />
            <Route
              path="/dashboard/business/edit/:id"
              element={<BusinessForm />}
            />
            <Route
              path="/dashboard/subcategories"
              element={<SubCategoriesPage />}
            />
            <Route
              path="/dashboard/neighborhoods"
              element={<NeighborhoodsPage />}
            />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/favorites" element={<UserFavorites />} />
        </Route>

        {/* Redirecionamento para página não encontrada */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
