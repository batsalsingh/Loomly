import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';
import { loadStripe } from '@stripe/stripe-js';
import { CheckoutElementsProvider } from '@stripe/react-stripe-js/checkout';
import CheckoutForm from '../components/CheckoutForm';
import { formatINR } from '../utils/currency';

const CheckoutPage = () => {
  const { cart, cartItemCount, fetchCart } = useCart();
  const { createOrder } = useOrder();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    state: '',
    country: 'USA', // Default value
    pinCode: '',
  });

  const handleChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const applyAddress = (address) => {
    setShippingInfo({
      address: address.addressLine1,
      city: address.city,
      state: address.state,
      country: address.country,
      pinCode: address.postalCode,
    });
  };

  useEffect(() => {
    const fetchSavedAddresses = async () => {
      try {
        const response = await api.get('/users/addresses');
        const addresses = response.data.data || [];
        setSavedAddresses(addresses);

        const defaultAddress = addresses.find(address => address.isDefault) || addresses[0];
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress._id);
          applyAddress(defaultAddress);
        }
      } catch (error) {
        console.error('Failed to fetch saved addresses', error);
      }
    };

    fetchSavedAddresses();
  }, []);

  const calculateTotal = () => {
      let total = 0;
      cart?.cart?.items?.forEach(item => {
          total += item.product.price * item.quantity;
      });
      return total;
  };

  useEffect(() => {
    const fetchStripeCheckoutSession = async () => {
      try {
        // Fetch Public Key
        const { data: configData } = await api.get('/payment/stripekey');
        const stripeApiKey = configData.data?.stripeApiKey;
        if (!stripeApiKey) {
          throw new Error('Stripe publishable key is not configured');
        }
        setStripePromise(loadStripe(stripeApiKey));

        // The backend calculates the total and creates the Checkout Session.
        const { data: clientSecretData } = await api.post('/payment/process', { shippingInfo });
        setClientSecret(clientSecretData.data.client_secret);
      } catch (error) {
        console.error("Failed to initialize Stripe", error);
        toast.error("Payment system temporarily unavailable. Please try again later.");
      }
    };

    const hasShippingInfo = Object.values(shippingInfo).every(Boolean);
    if (cartItemCount > 0 && hasShippingInfo) {
      fetchStripeCheckoutSession();
    }
  }, [cart, cartItemCount, shippingInfo]);

  if (cartItemCount === 0) {
      navigate("/cart"); // Redirect if cart is empty
      return null;
  }

  return (
    <div className="min-h-screen bg-black text-white pt-40 pb-20 px-4">
      <div className="container mx-auto">
        <h1 className="text-5xl font-primary tracking-widest text-center uppercase mb-12">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Shipping Details Form */}
          <div className="lg:col-span-3 bg-gray-900/50 p-6 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
            <form className="space-y-4">
              {savedAddresses.length > 0 && (
                <div>
                  <label htmlFor="savedAddress" className="block text-sm font-medium text-gray-400 mb-1">Saved Address</label>
                  <select
                    id="savedAddress"
                    value={selectedAddressId}
                    onChange={event => {
                      const address = savedAddresses.find(item => item._id === event.target.value);
                      setSelectedAddressId(event.target.value);
                      if (address) applyAddress(address);
                    }}
                    className="w-full bg-gray-800 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  >
                    {savedAddresses.map(address => (
                      <option key={address._id} value={address._id}>
                        {address.addressLine1}, {address.city}{address.isDefault ? ' (Default)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-400 mb-1">Address</label>
                <input type="text" name="address" id="address" value={shippingInfo.address} required onChange={handleChange} className="w-full bg-gray-800 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"/>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-400 mb-1">City</label>
                  <input type="text" name="city" id="city" value={shippingInfo.city} required onChange={handleChange} className="w-full bg-gray-800 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"/>
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-400 mb-1">State / Province</label>
                  <input type="text" name="state" id="state" value={shippingInfo.state} required onChange={handleChange} className="w-full bg-gray-800 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"/>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pinCode" className="block text-sm font-medium text-gray-400 mb-1">ZIP / Postal Code</label>
                  <input type="text" name="pinCode" id="pinCode" value={shippingInfo.pinCode} required onChange={handleChange} className="w-full bg-gray-800 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"/>
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-400 mb-1">Country</label>
                  <input type="text" name="country" id="country" value={shippingInfo.country} required onChange={handleChange} className="w-full bg-gray-800 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"/>
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2 h-fit">
            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800 mb-6">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-2">
                {cart?.cart?.items.map(item => (
                  <div key={item.product._id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-300 truncate">{item.product.name} <span className="text-gray-500">x{item.quantity}</span></span>
                    <span className="font-semibold">{formatINR(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-700 my-4"></div>
              <div className="flex justify-between font-bold text-white text-xl mb-6">
                <span>Total</span>
                <span>{formatINR(calculateTotal())}</span>
              </div>

                {/* Stripe Checkout Elements */}
              {clientSecret && stripePromise && (
                  <CheckoutElementsProvider stripe={stripePromise} options={{ clientSecret }}>
                      <CheckoutForm 
                          amount={calculateTotal()}
                          email={user?.email}
                          shippingInfo={shippingInfo}
                          createOrder={createOrder}
                          fetchCart={fetchCart}
                          navigate={navigate}
                      />
                  </CheckoutElementsProvider>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;