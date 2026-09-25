import { createContext, useState, useContext, useEffect } from "react";
import api from "../api";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const { fetchCart, clearCart } = useCart();
  const { fetchWishlist, clearWishlist } = useWishlist();

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const response = await api.get("/users/current-user");
        if (response.data.success) {
          setUser(response.data.data);
          setIsAuthenticated(true);
          await Promise.all([fetchCart(), fetchWishlist()]);
        }
      } catch {
        // +++ MODIFICATION: This block is now expected to run for unauthenticated users +++
        // We don't need to log an error here because the interceptor already informs us if a session truly expires.
        // This catch block simply handles the normal case of a user not being logged in on app start.
        setUser(null);
        setIsAuthenticated(false);
        clearCart();
        clearWishlist();
      } finally {
        setLoading(false);
      }
    };
    checkUserStatus();
  }, []);

  const login = async (credentials) => {
    const response = await api.post("/users/login", credentials);
    if (response.data.success) {
      setUser(response.data.data.user);
      setIsAuthenticated(true);
      // After successful login, fetch all user-specific data
      await Promise.all([fetchCart(), fetchWishlist()]);
    }
    return response.data;
  };

  const logout = async () => {
    await api.post("/users/logout");
    setUser(null);
    setIsAuthenticated(false);
    // After logout, clear all user-specific data
    clearCart();
    clearWishlist();
  };
  
  const register = async (formData) => {
    // FormData is used for multipart requests (i.e., with file uploads)
    const response = await api.post("/users/register", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  const updateUserInContext = (updatedUserData) => {
    setUser(prevUser => ({...prevUser, ...updatedUserData}));
  };

  const socialLogin = async (provider, userData) => {
    const endpoint = '/users/auth/google';
    const response = await api.post(endpoint, userData);
    if (response.data.success) {
      setUser(response.data.data.user);
      setIsAuthenticated(true);
      // After successful login, fetch all user-specific data
      await Promise.all([fetchCart(), fetchWishlist()]);
    }
    return response.data;
  };


  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUserInContext,
    socialLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};