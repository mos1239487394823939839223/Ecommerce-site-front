"use client";

import { useWishlist } from "@/components/WishlistProvider";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/CartProvider";

export default function WishlistPage() {
  const wishlistContext = useWishlist();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();

  // Local state for fallback
  const [localWishlistItems, setLocalWishlistItems] = useState<any[]>([]);
  const [localWishlistCount, setLocalWishlistCount] = useState(0);

  // Destructure with fallbacks to prevent errors
  const wishlistItems = (wishlistContext as any)?.wishlistItems || localWishlistItems;
  const wishlistCount = (wishlistContext as any)?.wishlistCount || localWishlistCount;
  const removeFromWishlist = (wishlistContext as any)?.removeFromWishlist;
  const addToWishlist = (wishlistContext as any)?.addToWishlist;
  const fetchWishlist = (wishlistContext as any)?.fetchWishlist;
  const loading = (wishlistContext as any)?.loading || false;

  // Early return if context is not loaded
  if (wishlistContext === null || wishlistContext === undefined) {
    console.log('WishlistPage: Context not loaded, showing loading...');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  // Refresh wishlist when component mounts
  useEffect(() => {
    console.log('WishlistPage: useEffect called', { isAuthenticated, hasFetchWishlist: !!fetchWishlist });
    if (isAuthenticated && fetchWishlist && typeof fetchWishlist === 'function') {
      console.log('WishlistPage: Calling fetchWishlist...');
      fetchWishlist();
    } else if (isAuthenticated) {
      console.log('WishlistPage: Fallback to localStorage...');
      // Fallback: load from localStorage if context is not available
      loadWishlistFromLocalStorage();
    }
  }, [isAuthenticated, fetchWishlist]);

  // Fallback function to load wishlist from localStorage
  const loadWishlistFromLocalStorage = async () => {
    try {
      console.log('WishlistPage: loadWishlistFromLocalStorage called');
      const wishlistIds = JSON.parse(localStorage.getItem('wishlist') || '[]');
      console.log('WishlistPage: wishlistIds from localStorage:', wishlistIds);
      
      if (wishlistIds.length > 0) {
        // Load products from API or mock data
        const { getProducts } = await import('@/services/clientApi');
        const productsResponse = await getProducts();
        const allProducts = productsResponse.data || [];
        const items = allProducts.filter((product: any) => wishlistIds.includes(product._id));
        
        console.log('WishlistPage: Found items:', items.length);
        // Update local state for display
        setLocalWishlistItems(items);
        setLocalWishlistCount(items.length);
      } else {
        console.log('WishlistPage: No items in localStorage');
        setLocalWishlistItems([]);
        setLocalWishlistCount(0);
      }
    } catch (error) {
      console.error('WishlistPage: Error loading wishlist from localStorage:', error);
    }
  };

  // Listen for wishlist updates from other pages
  useEffect(() => {
    const handleWishlistUpdate = () => {
      loadWishlistFromLocalStorage();
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    
    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, []);

  useEffect(() => {
    console.log('WishlistPage: State updated', { wishlistItems: wishlistItems.length, wishlistCount, loading, isAuthenticated });
  }, [wishlistItems, wishlistCount, loading, isAuthenticated]);

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      console.log('WishlistPage: handleRemoveFromWishlist called', { productId, hasRemoveFromWishlist: !!removeFromWishlist });
      if (removeFromWishlist && typeof removeFromWishlist === 'function') {
        await removeFromWishlist(productId);
      } else {
        // Fallback: remove from localStorage
        const wishlistIds = JSON.parse(localStorage.getItem('wishlist') || '[]');
        const updatedWishlist = wishlistIds.filter((id: string) => id !== productId);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        
        // Update local state
        const { getProducts } = await import('@/services/clientApi');
        const productsResponse = await getProducts();
        const allProducts = productsResponse.data || [];
        const items = allProducts.filter((product: any) => updatedWishlist.includes(product._id));
        setLocalWishlistItems(items);
        setLocalWishlistCount(items.length);
        
        // Dispatch event to update other pages
        window.dispatchEvent(new CustomEvent('wishlistUpdated'));
      }
    } catch (error) {
      console.error('WishlistPage: Error removing from wishlist:', error);
      alert('Failed to remove product from wishlist. Please try again.');
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      console.log('WishlistPage: handleAddToCart called', { productId });
      await addToCart(productId);
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
      console.error('WishlistPage: Error adding to cart:', error);
      alert('Failed to add product to cart. Please try again.');
    }
  };

  const handleAddToWishlist = async (productId: string) => {
    console.log('WishlistPage: handleAddToWishlist called', { productId, hasAddToWishlist: !!addToWishlist });
    if (!addToWishlist || typeof addToWishlist !== 'function') {
      console.error('WishlistPage: addToWishlist function not available');
      alert('Wishlist function not available. Please refresh the page.');
      return;
    }
    
    try {
      await addToWishlist(productId);
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-pink-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
      notification.textContent = 'Product added to wishlist!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 3000);
    } catch (error) {
      console.error('WishlistPage: Error adding to wishlist:', error);
      alert('Failed to add product to wishlist. Please try again.');
    }
  };

  
  if (!isAuthenticated) {
    console.log('WishlistPage: User not authenticated, showing login prompt');
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">My Wish List</h1>
            <div className="text-center py-12">
              <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Please login to view your wishlist</h3>
              <p className="text-gray-600 mb-6">Sign in to see your saved products and manage your wishlist</p>
              <div className="space-x-4">
                <button
                  onClick={() => router.push('/login')}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => router.push('/signup')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    console.log('WishlistPage: Loading state, showing skeleton');
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex space-x-4 p-4 border rounded-lg">
                  <div className="bg-gray-200 h-20 w-20 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                    <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                    <div className="bg-gray-200 h-6 rounded w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log('WishlistPage: Rendering main content', { wishlistItems: wishlistItems.length, wishlistCount, loading, isAuthenticated });
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">My wish List</h1>
          
          {/* Debug info */}
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
            <strong>Debug Info:</strong> Items: {wishlistItems.length}, Count: {wishlistCount}, Loading: {loading ? 'Yes' : 'No'}, Auth: {isAuthenticated ? 'Yes' : 'No'}
            <br />
            <strong>Context:</strong> {wishlistContext ? 'Loaded' : 'Not loaded'}
          </div>
          
          {wishlistItems.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wish list is empty</h3>
              <p className="text-gray-600 mb-6">Start adding products to your wish list by clicking the heart icon on any product</p>
              <div className="space-x-4">
                <a 
                  href="/products" 
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Browse Products
                </a>
                <a 
                  href="/" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Go Home
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">Found {wishlistItems.length} items in your wishlist</p>
              {wishlistItems.map((item: any, index: number) => (
                <div key={item._id || `wishlist-item-${index}`} className="flex items-center space-x-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <img 
                    src={item.imageCover || '/placeholder-image.jpg'} 
                    alt={item.title || 'Product'}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-lg">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.category?.name}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-green-600 text-lg">{item.price?.toLocaleString()} EGP</span>
                      <button
                        onClick={() => handleRemoveFromWishlist(item._id)}
                        className="text-red-500 hover:text-red-700 text-sm transition-colors flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddToCart(item._id)}
                    className="bg-green-50 hover:bg-green-100 text-green-600 border border-green-200 px-6 py-2 rounded-lg font-medium transition-colors flex-shrink-0"
                  >
                    Add To Cart
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
