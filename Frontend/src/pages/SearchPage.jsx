import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import SpotlightCard from '../components/SpotlightCard';
import FilterSidebar from '../components/FilterSidebar';
import useDebounce from '../hooks/useDebounce';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const keywordParam = searchParams.get('keyword') || '';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering & Pagination State
  const [keyword, setKeyword] = useState(keywordParam);
  const debouncedKeyword = useDebounce(keyword, 500);
  
  const [filters, setFilters] = useState({ price: {} });
  const debouncedFilters = useDebounce(filters, 500); // Debounce price inputs

  const [sort, setSort] = useState('-createdAt');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Sync URL keyword to state if it changes externally
  useEffect(() => {
    setKeyword(searchParams.get('keyword') || '');
  }, [searchParams]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        let queryStr = `/products?page=${page}`;
        
        if (debouncedKeyword) {
            queryStr += `&keyword=${encodeURIComponent(debouncedKeyword)}`;
        }
        
        if (sort) {
            queryStr += `&sort=${sort}`;
        }

        if (debouncedFilters.price.gte) {
            queryStr += `&price[gte]=${debouncedFilters.price.gte}`;
        }
        if (debouncedFilters.price.lte) {
            queryStr += `&price[lte]=${debouncedFilters.price.lte}`;
        }

        const response = await api.get(queryStr);
        if (response.data.success) {
          setProducts(response.data.data.products || []);
          setTotalPages(response.data.data.totalPages || 1);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [debouncedKeyword, debouncedFilters, sort, page]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearchChange = (e) => {
      setKeyword(e.target.value);
      setPage(1); // Reset to page 1 on new search
      if (e.target.value) {
          setSearchParams({ keyword: e.target.value });
      } else {
          setSearchParams({});
      }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-4 md:px-8 relative">
      <div className="container mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-primary tracking-widest uppercase mb-6">Shop All</h1>
          <div className="max-w-xl mx-auto text-gray-400">
             <input 
                type="text" 
                value={keyword}
                onChange={handleSearchChange}
                placeholder="Search products..."
                className="w-full bg-gray-900 border border-gray-800 text-white px-6 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all pl-6"
             />
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar (Filters) */}
            <div className="w-full lg:w-1/4">
                <FilterSidebar 
                    filters={filters} 
                    setFilters={(newFilters) => { setFilters(newFilters); setPage(1); }} 
                    sort={sort} 
                    setSort={(newSort) => { setSort(newSort); setPage(1); }} 
                />
            </div>

            {/* Product Grid */}
            <div className="w-full lg:w-3/4">
                {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.from({ length: 6 }).map((_, index) => (
                    <ProductCardSkeleton key={index} />
                    ))}
                </div>
                ) : products.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product) => (
                        <SpotlightCard key={product._id}>
                            <ProductCard product={product} />
                        </SpotlightCard>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center mt-12 gap-4">
                            <button 
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                                className="px-4 py-2 border border-gray-700 rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Previous
                            </button>
                            <span className="text-gray-400">Page {page} of {totalPages}</span>
                            <button 
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page === totalPages}
                                className="px-4 py-2 border border-gray-700 rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
                ) : (
                <div className="text-center py-20 bg-gray-900/30 rounded-lg border border-gray-800">
                    <h2 className="text-3xl text-gray-400 font-primary">No products found.</h2>
                    <p className="text-gray-500 mt-4">Try adjusting your search criteria or price filters.</p>
                </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
