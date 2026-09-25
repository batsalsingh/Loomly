import { useState, useEffect } from 'react';
import api from '../../api';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';
import { formatINR } from '../../utils/currency';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('orders');
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Forms
    const [newCategory, setNewCategory] = useState({ name: '', slug: '' });
    const [newProduct, setNewProduct] = useState({
        name: '', description: '', features: '', price: '', stock: '', category: '', brand: '', productImages: []
    });

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'orders') {
                const res = await api.get('/orders/admin/all');
                setOrders(res.data.data || []);
            } else if (activeTab === 'users') {
                const res = await api.get('/users/all-users');
                setUsers(res.data.data || []);
            } else if (activeTab === 'categories' || activeTab === 'products') {
                const res = await api.get('/categories');
                setCategories(res.data.data || []);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleOrderStatusChange = async (orderId, newStatus) => {
        try {
            await api.patch(`/orders/admin/status/${orderId}`, { status: newStatus });
            toast.success("Order status updated!");
            fetchData();
        } catch {
            toast.error("Failed to update status");
        }
    };

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        try {
            await api.post('/categories/create', newCategory);
            toast.success("Category created!");
            setNewCategory({ name: '', slug: '' });
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create category");
        }
    };

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', newProduct.name);
            formData.append('description', newProduct.description);
            formData.append('features', JSON.stringify(newProduct.features.split('\n').map(feature => feature.trim()).filter(Boolean)));
            formData.append('price', newProduct.price);
            formData.append('stock', newProduct.stock);
            formData.append('category', newProduct.category);
            formData.append('brand', newProduct.brand);
            Array.from(newProduct.productImages).forEach(file => {
                formData.append('productImages', file);
            });

            await api.post('/products/create', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success("Product created!");
            setNewProduct({ name: '', description: '', features: '', price: '', stock: '', category: '', brand: '', productImages: [] });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create product");
        }
    };

    return (
        <div className="min-h-screen bg-black text-white pt-40 pb-20 px-4 md:px-8">
            <div className="container mx-auto">
                <h1 className="text-5xl font-primary tracking-widest text-center uppercase mb-12">Admin Dashboard</h1>
                
                <div className="flex flex-wrap gap-4 mb-8 border-b border-gray-800 pb-4">
                    {['orders', 'users', 'categories', 'products'].map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)} 
                            className={`text-lg font-bold py-2 capitalize ${activeTab === tab ? 'text-brand-accent border-b-2 border-brand-accent' : 'text-gray-400 hover:text-gray-200'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="bg-gray-900/50 p-8 rounded-lg border border-gray-800">
                    {loading ? (
                        <div className="flex items-center justify-center gap-3 text-center text-gray-400 py-10">
                            <Loader size="sm" className="border-gray-500 border-t-brand-accent" />
                            <span>Loading data...</span>
                        </div>
                    ) : (
                        <>
                            {/* Orders Tab */}
                            {activeTab === 'orders' && (
                                <div className="space-y-4">
                                   <div className="overflow-x-auto">
                                        <table className="w-full text-left text-gray-300 border-collapse">
                                            <thead>
                                                <tr className="border-b border-gray-700 bg-gray-800/50">
                                                    <th className="p-3">Order ID</th>
                                                    <th className="p-3">User</th>
                                                    <th className="p-3">Total</th>
                                                    <th className="p-3">Status</th>
                                                    <th className="p-3">Update</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orders.map(order => (
                                                    <tr key={order._id} className="border-b border-gray-700/50 hover:bg-gray-800/30">
                                                        <td className="p-3 text-xs">{order._id}</td>
                                                        <td className="p-3">{order.owner?.fullName || 'N/A'}</td>
                                                        <td className="p-3 font-semibold text-brand-accent">{formatINR(order.totalPrice)}</td>
                                                        <td className="p-3">{order.orderStatus}</td>
                                                        <td className="p-3">
                                                            <select 
                                                                className="bg-gray-800 border border-gray-600 rounded p-1 text-sm outline-none text-white"
                                                                value={order.orderStatus}
                                                                onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                                                            >
                                                                <option value="Processing">Processing</option>
                                                                <option value="Shipped">Shipped</option>
                                                                <option value="Delivered">Delivered</option>
                                                                <option value="Cancelled">Cancelled</option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                   </div>
                                </div>
                            )}

                            {/* Users Tab */}
                            {activeTab === 'users' && (
                                <div className="space-y-4">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-gray-300 border-collapse">
                                            <thead>
                                                <tr className="border-b border-gray-700 bg-gray-800/50">
                                                    <th className="p-3">Name</th>
                                                    <th className="p-3">Email</th>
                                                    <th className="p-3">Role</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users.map(user => (
                                                    <tr key={user._id} className="border-b border-gray-700/50 hover:bg-gray-800/30">
                                                        <td className="p-3 font-medium text-white">{user.fullName || 'N/A'}</td>
                                                        <td className="p-3">{user.email}</td>
                                                        <td className="p-3">
                                                            <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'ADMIN' ? 'bg-red-500/20 text-red-500' : 'bg-gray-700 text-gray-300'}`}>
                                                                {user.role}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Categories Tab */}
                            {activeTab === 'categories' && (
                                <div className="space-y-4">
                                    <h2 className="text-xl font-bold mb-4">Create Category</h2>
                                    <form onSubmit={handleCreateCategory} className="flex gap-4">
                                        <input 
                                            type="text" placeholder="Name" required 
                                            className="bg-black border border-gray-800 p-2 rounded w-full outline-none text-white focus:border-brand-accent"
                                            value={newCategory.name} onChange={e => setNewCategory({...newCategory, name: e.target.value})}
                                        />
                                        <input 
                                            type="text" placeholder="Slug (e.g. men-tshirts)" required 
                                            className="bg-black border border-gray-800 p-2 rounded w-full outline-none text-white focus:border-brand-accent"
                                            value={newCategory.slug} onChange={e => setNewCategory({...newCategory, slug: e.target.value})}
                                        />
                                        <button type="submit" className="bg-brand-accent text-white px-6 py-2 rounded font-bold hover:bg-opacity-80">Add</button>
                                    </form>

                                    <h2 className="text-xl font-bold mt-8 mb-4">Existing Categories</h2>
                                    <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {categories.map(cat => (
                                            <li key={cat._id} className="bg-gray-800 p-3 rounded text-center border border-gray-700">{cat.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Products Tab */}
                            {activeTab === 'products' && (
                                <div className="space-y-4">
                                    <h2 className="text-xl font-bold mb-4">Create Product</h2>
                                    <form onSubmit={handleCreateProduct} className="space-y-4 max-w-2xl">
                                        <div className="grid grid-cols-2 gap-4">
                                            <input type="text" placeholder="Product Name" required className="bg-black border border-gray-800 p-2 rounded w-full text-white" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                                            <input type="number" placeholder="Price" required className="bg-black border border-gray-800 p-2 rounded w-full text-white" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                                            <input type="text" placeholder="Brand" required className="bg-black border border-gray-800 p-2 rounded w-full text-white" value={newProduct.brand} onChange={e => setNewProduct({...newProduct, brand: e.target.value})} />
                                            <input type="number" placeholder="Stock" required className="bg-black border border-gray-800 p-2 rounded w-full text-white" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} />
                                            <select required className="bg-black border border-gray-800 p-2 rounded w-full text-white" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                                                <option value="" disabled>Select Category</option>
                                                {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                                            </select>
                                        </div>
                                        <textarea placeholder="Description" required className="bg-black border border-gray-800 p-2 rounded w-full text-white h-24" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                                        <textarea placeholder="Product features (one per line)" className="bg-black border border-gray-800 p-2 rounded w-full text-white h-24" value={newProduct.features} onChange={e => setNewProduct({...newProduct, features: e.target.value})} />
                                        <input type="file" multiple accept="image/*" required className="bg-black border border-gray-800 p-2 rounded w-full text-white" onChange={e => setNewProduct({...newProduct, productImages: e.target.files})} />
                                        <button type="submit" className="bg-brand-accent text-white px-6 py-2 rounded font-bold w-full hover:bg-opacity-80">Upload Product</button>
                                    </form>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
