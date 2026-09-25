import { createContext, useState, useContext } from "react";
import api from "../api";

const WishlistContext = createContext();

export const useWishlist = () => {
  return useContext(WishlistContext);
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false); // Used for specific wishlist actions

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const response = await api.get("/wishlist/");
      setWishlist(response.data.data.items || []);
    } catch (error) {
      console.error("Failed to fetch wishlist", error);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
  }

  const toggleWishlist = async (productId) => {
    try {
      const response = await api.post("/wishlist/toggle", { productId });
      setWishlist(response.data.data.items);
      const isProductInWishlist = response.data.data.items.some(
        (item) => item.product._id === productId
      );
      return { success: true, added: isProductInWishlist };
    } catch (error) {
      console.error("Failed to toggle wishlist item", error);
      return {
        success: false,
        message: error.response?.data?.message || "An error occurred",
      };
    }
  };

  const isItemInWishlist = (productId) => {
    return wishlist.some((item) => item.product?._id === productId);
  };

  const value = {
    wishlist,
    wishlistItemCount: wishlist.length,
    loading,
    toggleWishlist,
    isItemInWishlist,
    fetchWishlist, // Expose for AuthContext
    clearWishlist, // Expose for AuthContext
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};