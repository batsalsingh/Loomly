import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import SpotlightCard from '../components/SpotlightCard';
import FilterSidebar from '../components/FilterSidebar';
import GenericPage from './GenericPage';

const Style = () => {
  const { styleName } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);
  
  // State for filters and sorting
  const [filters, setFilters] = useState({ price: {} });
  const [sort, setSort] = useState('-createdAt');

  const styleTitle = category ? category.name.toUpperCase() : styleName.replace('-', ' ').toUpperCase();

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        setError('');
        setNotFound(false);

        // Build the query string from state
        const params = new URLSearchParams();
        if (filters.price.gte) params.append('price[gte]', filters.price.gte);
        if (filters.price.lte) params.append('price[lte]', filters.price.lte);
        if (sort) params.append('sort', sort);
        const queryString = params.toString();

        const response = await api.get(`/products/style/${styleName}?${queryString}`);
        if (response.data.success) {
          setProducts(response.data.data.products);
          setCategory(response.data.data.category);
        } else {
          setError('Category not found.');
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          setError(err.response?.data?.message || 'Failed to fetch products.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryProducts();
  }, [styleName, filters, sort]); // Refetch when state changes

  if (notFound) {
    return (
      <GenericPage title="404: Lost in the Void">
        <p>This category does not exist.</p>
        <Link to="/" className="text-brand-accent hover:underline">Return to the known universe.</Link>
      </GenericPage>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-40 pb-20 px-4 md:px-8">
      <div className="container mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-primary tracking-widest uppercase">{styleTitle}</h1>
          <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
            {`Browse our entire collection of ${styleTitle.toLowerCase()} pieces.`}
          </p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <FilterSidebar 
              filters={filters} 
              setFilters={setFilters} 
              sort={sort} 
              setSort={setSort} 
            />
          </aside>
          <main className="lg:col-span-3">
            {error ? (
              <div className="text-center py-20">
                <h2 className="text-2xl text-red-500">Error fetching products.</h2>
                <p className="text-gray-600">{error}</p>
              </div>
            ) : loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, index) => <ProductCardSkeleton key={index} />)}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {products.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <SpotlightCard>
                      <ProductCard product={product} />
                    </SpotlightCard>
                  </motion.div>
                ))}
              </div>
            ) : (
               <div className="text-center py-20">
                 <h2 className="text-2xl text-gray-500">Currently not available.</h2>
                 <p className="text-gray-600">Please check back soon for products in this category.</p>
               </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Style;