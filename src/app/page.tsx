"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getProducts, getProductsByCategory, searchProducts, Product } from "@/services/clientApi";
import { useCart } from "@/components/CartProvider";
import { useAuth } from "@/components/AuthProvider";
import { FaStar, FaShoppingCart } from "react-icons/fa";
import Slider from "@/components/Slider";
import SearchBar from "@/components/SearchBar";
import CategoriesBar from "@/components/CategoriesBar";
import Heart from "@/components/HeartSimple";

function HomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [displayedProducts, setDisplayedProducts] = useState(20);
  const [loadingMore, setLoadingMore] = useState(false);

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  




  useEffect(() => {
    // Listen for wishlist updates
    const handleWishlistUpdate = () => {
      // console.log('HomePage: Wishlist updated, forcing re-render');
      // Force re-render by updating a dummy state
      setDisplayedProducts(prev => prev);
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    
    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, []);


  useEffect(() => {
    // Get search query from URL
    const search = searchParams.get('search');
    if (search) {
      setSearchQuery(search);
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
    setDisplayedProducts(20); // Reset displayed products when search or category changes
  }, [searchQuery, selectedCategory]);

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
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      console.log('HomePage: handleAddToCart called', { productId });
      await addToCart(productId);
      console.log('HomePage: Product added to cart successfully');
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
      if (error instanceof Error && error.message === 'Authentication required') {
        alert("Please login to add items to cart");
        window.location.href = "/login";
      } else {
        alert('Failed to add product to cart. Please try again.');
      }
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  const handleProductClick = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setDisplayedProducts(prev => prev + 20);
      setLoadingMore(false);
    }, 500);
  };


  return (
    <div className="min-h-screen">
      {/* 🖼️ Slider Section */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <Slider />
      </section>

      {/* 🔍 Search Bar Section */}
      <section className="bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      {/* 📂 Categories Bar */}
      <CategoriesBar
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
      />

      {/* 🛒 Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">

          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {searchQuery
                ? `Search Results for "${searchQuery}"`
                : selectedCategory
                  ? "Filtered Products"
                  : "Featured Products"}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {searchQuery
                ? `Found ${products.length} products matching your search`
                : selectedCategory
                  ? "Products in selected category"
                  : "Discover our handpicked selection of premium products at amazing prices"}
            </p>
          </div>

          {/* Clear Filters Button */}
          {(searchQuery || selectedCategory) && (
            <div className="text-center mb-8">
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Products Grid */}
          {loading ? (
            // Skeleton Loading
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                  <div className="bg-gray-200 aspect-square"></div>
                  <div className="p-3">
                    <div className="bg-gray-200 h-3 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-3 rounded w-2/3 mb-2"></div>
                    <div className="bg-gray-200 h-4 rounded mb-3"></div>
                    <div className="bg-gray-200 h-8 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            // No Products Found
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery
                  ? `No products found for "${searchQuery}"`
                  : selectedCategory
                    ? "No products found in this category"
                    : "No products available at the moment"}
              </p>
              {(searchQuery || selectedCategory) && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(null);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  View All Products
                </button>
              )}
            </div>
          ) : (
            // Render Products in Grid Layout (like the image) - 4 columns
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {products.slice(0, displayedProducts).map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group"
                  onClick={() => handleProductClick(product._id)}
                >
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.imageCover}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.priceAfterDiscount && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium z-10">
                        خصم
                      </div>
                    )}
                    
                    {/* Heart Button */}
                    <div className="absolute top-2 right-2 z-30">
                      <Heart 
                        productId={product._id}
                        size="sm"
                      />
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-3">
                    {/* Brand */}
                    <div className="text-xs text-gray-500 mb-1">{product.brand?.name || 'Unknown Brand'}</div>
                    
                    {/* Title */}
                    <h3 className="font-medium text-gray-900 mb-2 text-sm line-clamp-2 leading-tight">
                      {product.title}
                    </h3>

                    {/* Ratings */}
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-xs text-gray-500 ml-1">{(product.ratingsAverage || 0).toFixed(1)}</span>
                      </div>
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
                      className="w-full bg-green-600 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product._id);
                      }}
                    >
                      <FaShoppingCart className="w-3 h-3" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {products.length > displayedProducts && (
            <div className="text-center mt-12">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 mx-auto"
              >
                {loadingMore ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </>
                ) : (
                  <>
                    Load More Products
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h2>
          <p className="text-gray-600">Please wait...</p>
        </div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}
