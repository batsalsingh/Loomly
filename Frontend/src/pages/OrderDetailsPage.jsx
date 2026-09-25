import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import Skeleton from '../components/Skeleton';
import OrderTrackingTimeline from '../components/OrderTrackingTimeline';
import { ChevronRight } from 'lucide-react';
import { formatINR } from '../utils/currency';
import GenericPage from './GenericPage';

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/orders/${orderId}`);
        if (response.data.success) {
          setOrder(response.data.data);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          setError(err.response?.data?.message || "Failed to fetch order details.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-40 pb-20 px-4">
        <div className="container mx-auto max-w-4xl space-y-6">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <GenericPage title="404: Lost in the Void">
        <p>This order could not be found.</p>
        <Link to="/orders" className="text-brand-accent hover:underline">Return to order history.</Link>
      </GenericPage>
    );
  }
  
  if (error || !order) {
    return <div className="min-h-screen flex items-center justify-center text-center text-white">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white pt-40 pb-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-sm text-gray-400 mb-4 flex items-center">
            <Link to="/orders" className="hover:text-white">Order History</Link>
            <ChevronRight size={16} className="mx-1" />
            <span className="text-white">Order Details</span>
        </div>
        <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-start pb-4 border-b border-gray-700">
                <div>
                    <h1 className="text-2xl font-bold">Order #{order._id}</h1>
                    <p className="text-sm text-gray-400">Placed on {new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className={`px-3 py-1 text-sm rounded-full ${order.orderStatus === 'Delivered' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {order.orderStatus}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-6">
                <div>
                    <h2 className="text-xl font-bold mb-2">Shipping Address</h2>
                    <p className="text-gray-300">{order.shippingInfo.address}</p>
                    <p className="text-gray-300">{order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.pinCode}</p>
                    <p className="text-gray-300">{order.shippingInfo.country}</p>
                </div>
                <div>
                    <h2 className="text-xl font-bold mb-2">Order Summary</h2>
                    <div className="space-y-2">
                    <div className="flex justify-between"><span className="text-gray-400">Subtotal</span><span>{formatINR(order.totalPrice)}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Shipping</span><span>FREE</span></div>
                    <div className="flex justify-between font-bold text-xl pt-2 border-t border-gray-700 mt-2"><span className="text-white">Total</span><span className="text-brand-accent">{formatINR(order.totalPrice)}</span></div>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Items in this Order</h2>
                <div className="space-y-4">
                    {order.orderItems.map(item => (
                        <div key={item.product} className="flex items-center gap-4 bg-gray-800/50 p-3 rounded-md">
                            <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-md" />
                            <div className="flex-grow">
                                <p className="font-bold">{item.name}</p>
                                <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-semibold">{formatINR(item.price * item.quantity)}</p>
                        </div>
                    ))}
                </div>
            </div>

            <OrderTrackingTimeline 
              trackingHistory={order.trackingHistory}
              currentStatus={order.orderStatus}
            />
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;