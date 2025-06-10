import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthService from "../../api/auth";

const ProtectedRoute = ({ requiredRole = "user" }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: null,
    userRole: null,
    isLoading: true,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await AuthService.getCurrentUser();

        if (user) {
          setAuthState({
            isAuthenticated: true,
            userRole: user.role,
            isLoading: false,
          });
        } else {
          setAuthState({
            isAuthenticated: false,
            userRole: null,
            isLoading: false,
          });
        }
      } catch (error) {
        setAuthState({
          isAuthenticated: false,
          userRole: null,
          isLoading: false,
        });
      }
    };

    checkAuth();
  }, []);

  if (authState.isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Carregando...
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === "admin" && authState.userRole !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
