"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProducts, getProductsByCategory, searchProducts, getCategories, getBrands, Product } from "@/services/clientApi";
import { useCart } from "@/components/CartProvider";
import { useAuth } from "@/components/AuthProvider";
import { FaStar, FaShoppingCart, FaSearch, FaFilter, FaSort } from "react-icons/fa";
import Heart from "@/components/HeartSimple";

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [displayedProducts, setDisplayedProducts] = useState(20);
  const [totalResults, setTotalResults] = useState(0);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);

  // Context
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  // Fetch initial data
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedCategory, selectedBrand, sortBy, priceRange]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let response;
      
      if (searchQuery) {
        response = await searchProducts(searchQuery);
      } else if (selectedCategory) {
        response = await getProductsByCategory(selectedCategory);
      } else {
        response = await getProducts();
      }
      
      setProducts(response.data || []);
      setTotalResults(response.results || response.data?.length || 0);
      setDisplayedProducts(20); // Reset displayed products
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await getBrands();
      setBrands(response.data || []);
    } catch (error) {
      console.error("Error fetching brands:", error);
      setBrands([]);
    }
  };

  const handleProductClick = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  const handleAddToCart = async (productId: string) => {
    if (!isAuthenticated) {
      alert("Please login to add items to cart");
      window.location.href = "/login";
      return;
    }
    
    try {
      console.log('ProductsPage: handleAddToCart called', { productId });
      await addToCart(productId);
      console.log('ProductsPage: Product added to cart successfully');
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
      notification.textContent = 'Product added to cart successfully!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart. Please try again.');
    }
  };


  const handleLoadMore = () => {
    setDisplayedProducts(prev => prev + 20);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedBrand("");
    setSortBy("");
    setPriceRange({ min: "", max: "" });
  };

  const visibleProducts = products.slice(0, displayedProducts);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
          <p className="text-gray-600">{totalResults} products found</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <FaFilter />
              <span>Filters</span>
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brand Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">All Brands</option>
                    {brands.map((brand) => (
                      <option key={brand._id} value={brand._id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Default</option>
                    <option value="price">Price: Low to High</option>
                    <option value="-price">Price: High to Low</option>
                    <option value="title">Name: A to Z</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {loading ? (
            Array(8).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2 w-3/4"></div>
                <div className="bg-gray-200 h-4 rounded mb-4 w-1/2"></div>
                <div className="bg-gray-200 h-8 rounded w-full"></div>
              </div>
            ))
          ) : (
            visibleProducts.map((product) => (
              <div 
                key={product._id} 
                onClick={() => handleProductClick(product._id)}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 group cursor-pointer"
              >
                {/* Product Image */}
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={product.imageCover || '/placeholder-image.jpg'}
                    alt={product.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  
                  {/* Discount Badge */}
                  {product.priceAfterDiscount && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                      خصم
                    </div>
                  )}
                  
                  {/* Wishlist Button */}
                  <div className="absolute top-2 right-2 z-30">
                    <Heart 
                      productId={product._id}
                      size="sm"
                    />
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  {/* Brand */}
                  <div className="text-xs text-gray-500 mb-1">{product.brand?.name}</div>
                  
                  {/* Title */}
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.title}</h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(product.ratingsAverage || 0)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-1">
                      {product.ratingsAverage?.toFixed(1) || '0.0'}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mb-3">
                    {product.priceAfterDiscount ? (
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-red-600">
                          {(product.priceAfterDiscount || 0).toLocaleString()} EGP
                        </span>
                        <span className="text-xs text-gray-500 line-through">
                          {(product.price || 0).toLocaleString()} EGP
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm font-bold text-gray-900">
                        {(product.price || 0).toLocaleString()} EGP
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product._id);
                    }}
                    className="w-full bg-green-600 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
                  >
                    <FaShoppingCart className="w-3 h-3" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More Button */}
        {products.length > displayedProducts && (
          <div className="text-center">
            <button
              onClick={handleLoadMore}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 mx-auto"
            >
              Load More Products
              <FaSort className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

