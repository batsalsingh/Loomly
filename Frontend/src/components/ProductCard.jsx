import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { formatINR } from '../utils/currency';

const ProductCard = ({ product }) => (
  <Link to={`/product/${product._id}`} className="block group">
    <div className="relative overflow-hidden rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black shadow-xl hover:shadow-2xl hover:shadow-brand-accent/20 transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/0 to-brand-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
      <img
        src={product.thumbnail?.url || product.productImage?.url || 'https://via.placeholder.com/400x600?text=No+Image'}
        alt={product.name}
        className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>
      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-brand-accent border border-brand-accent/30">
        {formatINR(product.price)}
      </div>
      {product.ratings > 0 && (
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full">
          <Star size={12} className="text-yellow-400 fill-yellow-400" />
          <span className="text-xs text-white font-semibold">{product.ratings.toFixed(1)}</span>
        </div>
      )}
      <div className="absolute bottom-0 left-0 p-4 w-full z-20">
         <div className="bg-gradient-to-r from-black/80 to-black/60 backdrop-blur-md p-4 rounded-lg border border-white/10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-lg font-bold text-white group-hover:text-brand-accent transition-colors duration-300 truncate">{product.name}</h3>
            <p className="text-xs text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">View Details</p>
         </div>
      </div>
    </div>
  </Link>
);

export default ProductCard;