const FilterSidebar = ({ filters, setFilters, sort, setSort }) => {
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    // If value is empty, remove the key, otherwise set it
    const newPrice = { ...filters.price };
    if (value) {
      newPrice[name] = value;
    } else {
      delete newPrice[name];
    }
    setFilters(prev => ({ ...prev, price: newPrice }));
  };

  return (
    <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800 h-fit space-y-6 sticky top-32">
      <div>
        <h3 className="text-lg font-bold mb-4 uppercase tracking-wider text-gray-300">Sort By</h3>
        <select 
          value={sort} 
          onChange={(e) => setSort(e.target.value)}
          className="w-full bg-gray-800 text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"
        >
          <option value="-createdAt">Newest</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
          <option value="-ratings">Top Rated</option>
        </select>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4 uppercase tracking-wider text-gray-300">Price Range</h3>
        <div className="flex items-center gap-2">
          <input 
            type="number" 
            name="gte"
            placeholder="Min"
            min="0"
            value={filters.price.gte || ''}
            onChange={handlePriceChange}
            className="w-full bg-gray-800 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="text-gray-500">-</span>
          <input 
            type="number"
            name="lte"
            placeholder="Max"
            min="0"
            value={filters.price.lte || ''}
            onChange={handlePriceChange}
            className="w-full bg-gray-800 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;