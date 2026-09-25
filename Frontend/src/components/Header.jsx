import { useState, useEffect, useRef } from 'react';
import { Search, Heart, ShoppingCart, User } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';
import MegaMenu from './MegaMenu';
import { navLinks } from '../data/navigation';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import useDebounce from '../hooks/useDebounce'; // +++ NEW
import api from '../api'; // +++ NEW

const Header = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]); // +++ NEW
  const [isSearchOpen, setIsSearchOpen] = useState(false); // +++ NEW
  const navigate = useNavigate();
  const searchRef = useRef(null); // +++ NEW

  const { isAuthenticated } = useAuth();
  const { cartItemCount } = useCart();
  const { wishlistItemCount } = useWishlist();

  const [dbCategories, setDbCategories] = useState([]);

  const debouncedSearchQuery = useDebounce(searchQuery, 300); // +++ NEW

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/categories');
        setDbCategories(res.data.data || []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchCats();
  }, []);

  // Effect for fetching instant search results
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (debouncedSearchQuery.length > 1) {
        try {
          const response = await api.get(`/products?keyword=${debouncedSearchQuery}&limit=5`);
          if (response.data.success) {
            setSearchResults(response.data.data.products);
            setIsSearchOpen(true);
          }
        } catch (error) {
          console.error("Failed to fetch search results:", error);
        }
      } else {
        setSearchResults([]);
        setIsSearchOpen(false);
      }
    };
    fetchSearchResults();
  }, [debouncedSearchQuery]);

  // Effect for closing search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const extendedNavLinks = [
    ...navLinks,
    ...(dbCategories.length > 0 ? [{
      id: 'collections',
      title: 'Our Collections',
      columns: [{
        title: 'Categories',
        links: dbCategories.map(cat => ({
          name: cat.name,
          href: `/style/${cat.slug}`
        }))
      }]
    }] : [])
  ];

  const iconClasses = "w-6 h-6 text-white hover:text-brand-accent transition-all duration-300 hover:scale-125 hover:rotate-12 hover:drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]";

  return (
    <header 
        className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-black via-red-950/30 to-black backdrop-blur-xl border-b-2 border-brand-accent/50 shadow-2xl shadow-brand-accent/20"
        onMouseLeave={() => setActiveMenu(null)}
    >
      <div className="container mx-auto flex justify-between items-center px-4 md:px-0 relative">
        {/* Glowing lines effect - removed for cleaner look */}
        
        <div className="flex items-center gap-x-12 relative z-10">
            <Link to="/" className="text-4xl md:text-5xl font-primary font-black tracking-widest text-brand-accent hover:text-white transition-all duration-500 transform hover:scale-110 hover:rotate-1 animate-pulse drop-shadow-[0_0_25px_rgba(220,38,38,1)]">
                Loomly
            </Link>
            <nav className="hidden md:flex items-center gap-x-8 uppercase text-sm tracking-wider h-[78px]">
                {extendedNavLinks.map((navItem) => (
                  <div 
                    key={navItem.id}
                    className="py-6 h-full flex items-center group"
                    onMouseEnter={() => setActiveMenu(navItem.columns ? navItem.id : null)}
                  >
                     <NavLink 
                        to={navItem.href || '#'}
                        className={({isActive}) => `font-bold transition-all duration-300 ${isActive && !navItem.columns ? 'text-brand-accent' : 'text-white'} hover:text-brand-accent relative before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 before:bg-brand-accent before:transition-all before:duration-300 hover:before:w-full group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] transform group-hover:scale-110`}
                      >
                         {navItem.title}
                      </NavLink>
                  </div>
                ))}
            </nav>
        </div>
        
        <div className="flex items-center gap-x-4 md:gap-x-6">
            <div ref={searchRef} className="relative hidden lg:block">
              <form onSubmit={handleSearchSubmit}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={20} />
                <input 
                  type="text" 
                  placeholder="Search for products & more" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length > 1 && setIsSearchOpen(true)}
                  className="bg-gradient-to-r from-gray-900/80 via-red-950/20 to-gray-900/80 w-64 text-white pl-10 pr-4 py-2.5 rounded-lg border-2 border-brand-accent/30 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent focus:shadow-[0_0_15px_rgba(239,68,68,0.5)] text-sm transition-all duration-300 hover:border-brand-accent/60"
                />
              </form>
              {/* +++ NEW: Instant Search Dropdown +++ */}
              {isSearchOpen && searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-gray-900 border border-gray-700 rounded-md shadow-lg overflow-hidden animate-fade-in-down">
                  <ul>
                    {searchResults.map(product => (
                      <li key={product._id}>
                        <Link 
                          to={`/product/${product._id}`}
                          onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                          className="flex items-center p-3 hover:bg-gray-800 transition-colors"
                        >
                          <img src={product.thumbnail?.url} alt={product.name} className="w-10 h-14 object-cover rounded-md mr-4" />
                          <span className="text-sm font-semibold">{product.name}</span>
                        </Link>
                      </li>
                    ))}
                     <li className="border-t border-gray-700">
                        <Link 
                            to={`/search?keyword=${encodeURIComponent(searchQuery)}`}
                            onClick={() => { setIsSearchOpen(false); }}
                            className="block text-center p-2 text-sm font-bold text-brand-accent hover:bg-gray-800"
                        >
                            View all results
                        </Link>
                     </li>
                  </ul>
                </div>
              )}
            </div>

            <div 
                className="relative group" 
                onMouseEnter={() => setActiveMenu('profile')}
            >
                <div className="flex flex-col items-center cursor-pointer">
                    <User className={iconClasses} />
                    <span className="text-xs text-white group-hover:text-brand-accent transition-colors duration-300 font-semibold">{isAuthenticated ? 'Profile' : 'Login'}</span>
                </div>
                {activeMenu === 'profile' && <ProfileDropdown />}
            </div>
            
            <Link to="/wishlist" className="relative flex flex-col items-center cursor-pointer group">
                <Heart className={iconClasses} />
                <span className="text-xs text-white group-hover:text-brand-accent transition-colors duration-300 font-semibold">Wishlist</span>
                 {isAuthenticated && wishlistItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-br from-brand-accent to-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce shadow-lg shadow-brand-accent/50">
                        {wishlistItemCount}
                    </span>
                 )}
            </Link>

            <Link to="/cart" className="relative flex flex-col items-center cursor-pointer group">
                 <ShoppingCart className={iconClasses} />
                 <span className="text-xs text-white group-hover:text-brand-accent transition-colors duration-300 font-semibold">Bag</span>
                 {isAuthenticated && cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-br from-brand-accent to-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce shadow-lg shadow-brand-accent/50">
                        {cartItemCount}
                    </span>
                 )}
            </Link>
        </div>
      </div>
      
       <MegaMenu menuData={extendedNavLinks.find(nav => nav.id === activeMenu)} />
    </header>
  );
};

export default Header;