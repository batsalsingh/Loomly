import { useState, useEffect } from 'react';
import { useOrder } from '../context/OrderContext';
import { Link } from 'react-router-dom';
import OrderHistorySkeleton from '../components/skeletons/OrderHistorySkeleton';
import { formatINR } from '../utils/currency';

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { getMyOrders } = useOrder();

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            const result = await getMyOrders();
            if (result.success) {
                setOrders(result.orders);
            }
            setLoading(false);
        };
        fetchOrders();
    }, [getMyOrders]);

    if (loading) {
        return <OrderHistorySkeleton />;
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col items-center justify-center text-center pt-24 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                <div className="relative z-10 animate-fade-in-up">
                  <h1 className="text-6xl font-primary tracking-widest bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">NO ORDERS FOUND</h1>
                  <p className="text-gray-400 mt-6 text-lg">You haven't placed any orders yet. Let's change that.</p>
                  <Link to="/" className="inline-block mt-8 bg-gradient-to-r from-brand-accent to-red-600 text-white font-bold py-3 px-8 rounded-lg hover:shadow-lg hover:shadow-brand-accent/50 transition-all transform hover:scale-105">
                      START SHOPPING
                  </Link>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white pt-40 pb-20 px-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            <div className="container mx-auto relative z-10">
                <h1 className="text-5xl font-primary tracking-widest text-center uppercase mb-12 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">Order History</h1>
                <div className="space-y-6 max-w-4xl mx-auto">
                    {orders.map(order => (
                        <Link key={order._id} to={`/orders/${order._id}`} className="block bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-brand-accent/50 hover:shadow-lg hover:shadow-brand-accent/20 transition-all duration-300">
                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-700">
                                <div>
                                    <h2 className="font-bold text-lg">Order ID: <span className="text-gray-400 font-mono text-sm">{order._id}</span></h2>
                                    <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className={`px-3 py-1 text-sm rounded-full ${order.orderStatus === 'Delivered' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                    {order.orderStatus}
                                </div>
                            </div>
                            <div className="space-y-3 mb-4">
                                {order.orderItems.map(item => (
                                    <div key={item.product} className="flex items-center space-x-4">
                                        <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-md"/>
                                        <div>
                                            <p className="font-semibold">{item.name}</p>
                                            <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                             <div className="text-right font-bold text-xl border-t border-gray-700 pt-4">
                                Total: {formatINR(order.totalPrice)}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderHistoryPage;