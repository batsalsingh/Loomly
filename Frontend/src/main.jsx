import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';
import { OrderProvider } from './context/OrderContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Cart and Wishlist providers MUST wrap AuthProvider */}
    <CartProvider>
      <WishlistProvider>
        <AuthProvider>
          <OrderProvider>
            <App />
            <Toaster 
              position="bottom-right"
              toastOptions={{
                className: 'bg-gray-800 text-white border border-gray-700',
                style: {
                  background: '#1F2937',
                  color: '#F9FAFB',
                  border: '1px solid #374151',
                }
              }} 
            />
          </OrderProvider>
        </AuthProvider>
      </WishlistProvider>
    </CartProvider>
  </StrictMode>,
)