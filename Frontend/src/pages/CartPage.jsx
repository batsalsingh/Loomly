// src/pages/CartPage.jsx

import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Minus, Plus } from "lucide-react";
import CartSkeleton from '../components/skeletons/CartSkeleton';
import { formatINR } from '../utils/currency';

const CartPage = () => {
  const { cart, loading, removeFromCart, updateCartQuantity } = useCart();
  const navigate = useNavigate();

  const handleRemove = async (productId, size) => {
    const toastId = toast.loading("Removing item...");
    const result = await removeFromCart(productId, size);
    if (result.success) {
      toast.success(result.message, { id: toastId });
    } else {
      toast.error(result.message, { id: toastId });
    }
  };

  const handleQuantityChange = (productId, newQuantity, size) => {
    if (newQuantity < 1) {
      handleRemove(productId, size);
      return;
    }
    updateCartQuantity(productId, newQuantity, size);
  };

  if (loading && !cart) {
      return <CartSkeleton />;
  }
  
  if (!cart || !cart.cart || cart.cart.items.length === 0) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col items-center justify-center text-center pt-24 px-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            <div className="relative z-10 animate-fade-in-up">
              <h1 className="text-6xl font-primary tracking-widest bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">YOUR BAG IS EMPTY</h1>
              <p className="text-gray-400 mt-6 text-lg">Looks like you haven't added anything to your bag yet.</p>
              <Link to="/" className="inline-block mt-8 bg-gradient-to-r from-brand-accent to-red-600 text-white font-bold py-3 px-8 rounded-lg hover:shadow-lg hover:shadow-brand-accent/50 transition-all transform hover:scale-105">
                  CONTINUE SHOPPING
              </Link>
            </div>
        </div>
      );
  }

  const cartTotal = cart.cart.items.reduce((total, item) => {
    if (!item?.product) return total;
    return total + item.product.price * item.quantity;
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white pt-40 pb-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      <div className="container mx-auto relative z-10">
        <h1 className="text-5xl font-primary tracking-widest text-center uppercase mb-12 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">Shopping Bag</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.cart.items.map(item => (
              // Add a check to ensure item and product exist before rendering
              item && item.product && (
                <div key={`${item.product._id}-${item.size}`} className="flex items-center bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-sm p-4 rounded-xl border border-gray-700/50 hover:border-brand-accent/30 transition-all duration-300 shadow-lg">
                  <Link to={`/product/${item.product._id}`} className="group">
                      <img src={item.product.thumbnail?.url} alt={item.product.name} className="w-24 h-32 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300" />
                  </Link>
                  <div className="ml-4 flex-grow">
                    <Link to={`/product/${item.product._id}`}>
                      <h2 className="font-bold text-lg hover:text-brand-accent transition-colors">{item.product.name}</h2>
                    </Link>
                    <div className="flex items-center gap-2 mt-2">
                        <p className="text-gray-400 mr-2">Qty:</p>
                        <button onClick={() => handleQuantityChange(item.product._id, item.quantity - 1, item.size)} className="p-1 rounded-full border border-gray-700 hover:bg-gray-700"><Minus size={16}/></button>
                        <span className="font-bold w-6 text-center">{item.quantity}</span>
                        <button onClick={() => handleQuantityChange(item.product._id, item.quantity + 1, item.size)} className="p-1 rounded-full border border-gray-700 hover:bg-gray-700"><Plus size={16}/></button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">{formatINR(item.product.price * item.quantity)}</p>
                    <button onClick={() => handleRemove(item.product._id, item.size)} className="text-sm text-red-500 hover:underline mt-2">Remove</button>
                  </div>
                </div>
              )
            ))}
          </div>

          <div className="lg:col-span-1 bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl p-6 rounded-2xl border border-gray-700/50 h-fit shadow-2xl sticky top-24">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Order Summary</h2>
            <div className="space-y-4 text-gray-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatINR(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
              <div className="border-t border-gray-700 my-4"></div>
              <div className="flex justify-between font-bold text-white text-xl">
                <span>Total</span>
                <span>{formatINR(cartTotal)}</span>
              </div>
            </div>
            <button onClick={() => navigate('/checkout')} className="w-full mt-6 bg-gradient-to-r from-brand-accent to-red-600 text-white font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-brand-accent/50 transition-all duration-300 transform hover:scale-105">
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;