import { createContext, useContext } from "react";
import api from "../api";
import { useAuth } from "./AuthContext";

const OrderContext = createContext();

export const useOrder = () => {
  return useContext(OrderContext);
};

export const OrderProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const createOrder = async ({ shippingInfo, paymentInfo }) => {
    if (!isAuthenticated) return { success: false, message: "Please log in." };

    try {
      const response = await api.post("/orders/create", { shippingInfo, paymentInfo });
      return { success: true, order: response.data.data, message: "Order placed successfully!" };
    } catch (error) {
      console.error("Failed to create order", error);
      return { success: false, message: error.response?.data?.message || "An error occurred" };
    }
  };

  const getMyOrders = async () => {
    if (!isAuthenticated) return { success: false, message: "Please log in." };

    try {
      const response = await api.get("/orders/my-orders");
      return { success: true, orders: response.data.data };
    } catch (error) {
      console.error("Failed to fetch orders", error);
      return { success: false, message: error.response?.data?.message || "An error occurred" };
    }
  };

  const value = {
    createOrder,
    getMyOrders,
  };

  return (
    <OrderContext.Provider value={value}>
        {children}
    </OrderContext.Provider>
  );
};