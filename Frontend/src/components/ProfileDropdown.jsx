import { User, Heart, ShoppingCart, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProfileDropdown = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/'); // Navigate to home after logout
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-64 bg-black/70 backdrop-blur-xl border border-gray-700 rounded-md shadow-lg p-4 animate-fade-in-down">
      {isAuthenticated && user ? (
        // --- LOGGED IN VIEW ---
        <div>
          <div className="border-b border-gray-700 pb-4 mb-4">
            <h3 className="font-bold text-white truncate">Hello, {user.fullName}</h3>
            <p className="text-sm text-gray-400 truncate">{user.email}</p>
          </div>
          <ul className="space-y-3 text-gray-300">
             <li><Link to="/profile" className="flex items-center space-x-3 hover:text-white transition-colors"><User size={20} /><span>Profile</span></Link></li>
             <li><Link to="/orders" className="flex items-center space-x-3 hover:text-white transition-colors"><ShoppingCart size={20} /><span>Orders</span></Link></li>
             <li><Link to="/wishlist" className="flex items-center space-x-3 hover:text-white transition-colors"><Heart size={20} /><span>Wishlist</span></Link></li>
             <li onClick={handleLogout} className="flex items-center space-x-3 hover:text-white cursor-pointer transition-colors pt-3 border-t border-gray-700 mt-3"><LogOut size={20} /><span>Logout</span></li>
          </ul>
        </div>
      ) : (
        // --- LOGGED OUT VIEW ---
        <div>
          <div className="border-b border-gray-700 pb-4 mb-4">
              <h3 className="font-bold text-white">Welcome</h3>
              <p className="text-sm text-gray-400">To access your account & manage orders</p>
              <Link to="/login" className="block w-full mt-3 text-center font-bold text-brand-accent border-2 border-brand-accent py-2 rounded-md hover:bg-brand-accent hover:text-black transition-colors duration-300">
                  LOGIN / SIGNUP
              </Link>
          </div>
          <ul className="space-y-3 text-gray-300">
             <li><Link to="/orders" className="flex items-center space-x-3 hover:text-white transition-colors"><ShoppingCart size={20} /><span>Orders</span></Link></li>
             <li><Link to="/wishlist" className="flex items-center space-x-3 hover:text-white transition-colors"><Heart size={20} /><span>Wishlist</span></Link></li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;