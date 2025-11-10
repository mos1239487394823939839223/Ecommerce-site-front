"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getWishlist, addToWishlist as addToWishlistAPI, removeFromWishlist as removeFromWishlistAPI, Product } from '@/services/clientApi';

const wishlistService = {
  toggleWishlist: (productId: string) => {
    const wishlistIds = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const index = wishlistIds.indexOf(productId);
    
    if (index > -1) {
      wishlistIds.splice(index, 1);
    } else {
      wishlistIds.push(productId);
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlistIds));
    
    window.dispatchEvent(new CustomEvent('wishlistUpdated'));
  }
};

interface WishlistContextType {
  wishlistItems: Product[];
  wishlistCount: number;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  fetchWishlist: () => Promise<void>;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('WishlistProvider: Component mounted');
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      console.log('WishlistProvider: fetchWishlist called');
      
      const token = localStorage.getItem('token');
      console.log('WishlistProvider: Token exists:', !!token);
      
      if (token) {
        try {
          console.log('WishlistProvider: Attempting API call...');
          const response = await getWishlist(token);
          console.log('WishlistProvider: API response:', response);
          
          if (response && response.data && Array.isArray(response.data)) {
            console.log('WishlistProvider: Setting wishlist items from API:', response.data.length);
            setWishlistItems(response.data);
            setWishlistCount(response.data.length);
            return;
          }
        } catch (apiError) {
          console.error('WishlistProvider: API Error details:', apiError);
          console.log('WishlistProvider: Falling back to localStorage...');
        }
      }
      
      // Fallback to localStorage
      console.log('WishlistProvider: Using localStorage fallback...');
      const wishlistIds = JSON.parse(localStorage.getItem('wishlist') || '[]');
      console.log('WishlistProvider: LocalStorage wishlist IDs:', wishlistIds);
      
      if (wishlistIds.length > 0) {
        // Try to get products from API
        try {
          const { getProducts } = await import('@/services/clientApi');
          const productsResponse = await getProducts();
          const allProducts = productsResponse.data || [];
          const items = allProducts.filter((product: any) => wishlistIds.includes(product._id));
          
          setWishlistItems(items);
          setWishlistCount(items.length);
          console.log('WishlistProvider: Wishlist state updated with', items.length, 'items from API');
        } catch (error) {
          console.error('WishlistProvider: Error fetching products for wishlist:', error);
          setWishlistItems([]);
          setWishlistCount(0);
        }
      } else {
        setWishlistItems([]);
        setWishlistCount(0);
      }
    } catch (error) {
      console.error('WishlistProvider: Error in fetchWishlist:', error);
      setWishlistItems([]);
      setWishlistCount(0);
    } finally {
      setLoading(false);
      console.log('WishlistProvider: fetchWishlist complete');
    }
  };


  const addToWishlist = async (productId: string) => {
    try {
      setLoading(true);
      // console.log('Adding to wishlist:', productId);
      
      // Try to add via real API first
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // console.log('Adding to wishlist via API...');
          const response = await addToWishlistAPI(productId, token);
          // console.log('API add to wishlist response:', response);
          
          // Handle the correct API response structure
          if (response.status === 'success' && response.data && Array.isArray(response.data)) {
            // For add/remove operations, we need to fetch the full wishlist again
            // because the API returns only product IDs, not full product data
            await fetchWishlist();
            // console.log('Successfully added to wishlist via API');
            return;
          } else if (response.data && Array.isArray(response.data)) {
            // Fallback for different response structure
            await fetchWishlist();
            // console.log('Successfully added to wishlist via API (fallback)');
            return;
          }
        } catch (apiError) {
          console.error('API error adding to wishlist:', apiError);
          // Check if it's an authentication error
          if (apiError instanceof Error && (apiError.message.includes('401') || apiError.message.includes('not logged in'))) {
            // Clear invalid token
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            throw new Error('Your session has expired. Please login again.');
          }
          // For other API errors, fall back to mock data
          // console.log('API not available, falling back to mock data');
        }
      } else {
        // console.log('No token found, using mock data');
      }
      
      // Fallback to mock data
      // console.log('Using mock data for add to wishlist');
      wishlistService.toggleWishlist(productId);
      await fetchWishlist();
      // console.log('Successfully added to wishlist via mock data');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      // Only throw if it's an authentication error
      if (error instanceof Error && (error.message.includes('session has expired') || error.message.includes('login'))) {
        throw error;
      }
      // For other errors, try mock data fallback
      try {
        // console.log('Trying mock data fallback after error');
        wishlistService.toggleWishlist(productId);
        await fetchWishlist();
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        throw new Error('Failed to update wishlist. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      setLoading(true);
      // console.log('Removing from wishlist:', productId);
      
      // Try to remove via real API first
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // console.log('Removing from wishlist via API...');
          const response = await removeFromWishlistAPI(productId, token);
          // console.log('API remove from wishlist response:', response);
          
          // Handle the correct API response structure
          if (response.status === 'success') {
            // For add/remove operations, we need to fetch the full wishlist again
            // because the API returns only product IDs, not full product data
            await fetchWishlist();
            // console.log('Successfully removed from wishlist via API');
            return;
          } else if (response.data && Array.isArray(response.data)) {
            // Fallback for different response structure
            await fetchWishlist();
            // console.log('Successfully removed from wishlist via API (fallback)');
            return;
          }
        } catch (apiError) {
          console.error('API error removing from wishlist:', apiError);
          // Check if it's an authentication error
          if (apiError instanceof Error && (apiError.message.includes('401') || apiError.message.includes('not logged in'))) {
            // Clear invalid token
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            throw new Error('Your session has expired. Please login again.');
          }
          // For other API errors, fall back to mock data
          // console.log('API not available, falling back to mock data');
        }
      } else {
        // console.log('No token found, using mock data');
      }
      
      // Fallback to mock data
      // console.log('Using mock data for remove from wishlist');
      wishlistService.toggleWishlist(productId);
      await fetchWishlist();
      // console.log('Successfully removed from wishlist via mock data');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      // Only throw if it's an authentication error
      if (error instanceof Error && (error.message.includes('session has expired') || error.message.includes('login'))) {
        throw error;
      }
      // For other errors, try mock data fallback
      try {
        // console.log('Trying mock data fallback after error');
        wishlistService.toggleWishlist(productId);
        await fetchWishlist();
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        throw new Error('Failed to update wishlist. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (productId: string) => {
    try {
      setLoading(true);
      console.log('=== TOGGLING WISHLIST ===');
      console.log('Product ID:', productId);
      console.log('Current wishlist items:', wishlistItems.length);
      
      // Check if product is already in wishlist (check both state and localStorage)
      const isInWishlistState = wishlistItems.some(item => item._id === productId);
      const wishlistIds = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const isInWishlistLocalStorage = wishlistIds.includes(productId);
      const isInWishlist = isInWishlistState || isInWishlistLocalStorage;
      
      console.log('Product is currently in wishlist:', { isInWishlistState, isInWishlistLocalStorage, isInWishlist });
      
      if (isInWishlist) {
        console.log('Removing from wishlist...');
        await removeFromWishlist(productId);
      } else {
        console.log('Adding to wishlist...');
        await addToWishlist(productId);
      }
      
      console.log('=== TOGGLE COMPLETE ===');
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      
      // Show specific error messages based on error type
      if (error instanceof Error) {
        if (error.message.includes('session has expired') || error.message.includes('login')) {
          alert('Your session has expired. Please login again to manage your wishlist.');
          // Redirect to login page
          window.location.href = '/login';
        } else if (error.message.includes('Please login')) {
          alert('Please login to manage your wishlist.');
          // Redirect to login page
          window.location.href = '/login';
        } else {
          // For other errors, try to continue with mock data
          console.log('Attempting to continue with mock data after error');
          try {
            const isInWishlist = wishlistItems.some(item => item._id === productId);
            if (isInWishlist) {
              wishlistService.toggleWishlist(productId);
              await fetchWishlist();
            } else {
              wishlistService.toggleWishlist(productId);
              await fetchWishlist();
            }
          } catch (fallbackError) {
            console.error('Fallback also failed:', fallbackError);
            alert('Failed to update wishlist. Please try again.');
          }
        }
      } else {
        alert('Failed to update wishlist. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId: string): boolean => {
    // Check if product is in current wishlist items
    const result = wishlistItems.some(item => item._id === productId);
    console.log('WishlistProvider: isInWishlist check:', { productId, result, wishlistItems: wishlistItems.length });
    
    // Also check localStorage as fallback
    if (!result) {
      const wishlistIds = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const localStorageResult = wishlistIds.includes(productId);
      console.log('WishlistProvider: localStorage check:', { productId, localStorageResult });
      return localStorageResult;
    }
    
    return result;
  };

  const contextValue = {
    wishlistItems,
    wishlistCount,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    fetchWishlist,
    loading
  };

  // Load wishlist after functions are defined
  useEffect(() => {
    console.log('WishlistProvider: useEffect triggered, calling fetchWishlist');
    fetchWishlist();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  console.log('WishlistProvider: Rendering with context value:', {
    wishlistItems: contextValue.wishlistItems.length,
    hasToggleWishlist: typeof contextValue.toggleWishlist,
    hasIsInWishlist: typeof contextValue.isInWishlist,
    loading: contextValue.loading,
    contextKeys: Object.keys(contextValue)
  });

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  console.log('useWishlist: Context received:', {
    hasContext: !!context,
    hasToggleWishlist: context && typeof context.toggleWishlist,
    contextKeys: context ? Object.keys(context) : []
  });
  
  if (context === undefined) {
    console.error('useWishlist must be used within a WishlistProvider');
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
