"use client";

import { useAuth } from "./AuthProvider";
import { useCart } from "./CartProvider";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();

  return (
    <nav className="bg-white border-b sticky top-0 z-20 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center gap-6 justify-between">
        <a href="/" className="flex items-center gap-2 text-green-600 font-bold text-xl">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
            <path d="M9 8V17H11V8H9ZM13 8V17H15V8H13Z"/>
          </svg>
          Fresh Cart
        </a>
        
        <div className="hidden md:flex items-center gap-6 text-gray-700">
          <a href="/" className="hover:text-green-600 transition-colors">Home</a>
          <a href="/cart" className="hover:text-green-600 transition-colors">Cart</a>
          <a href="/wishlist" className="hover:text-green-600 transition-colors">Wish List</a>
          <a href="/products" className="hover:text-green-600 transition-colors">Products</a>
          <a href="/categories" className="hover:text-green-600 transition-colors">Categories</a>
        <a href="/brands" className="hover:text-green-600 transition-colors">Brands</a>
        </div>
        
        <div className="flex items-center gap-4">
          <a href="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </a>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-700 text-sm">Hello, {user?.name}</span>
              <button
                onClick={logout}
                className="text-gray-700 hover:text-green-600 transition-colors text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <a href="/login" className="text-gray-700 hover:text-green-600 transition-colors text-sm">
                Login
              </a>
              <a href="/register" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                Sign Up
              </a>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="md:hidden border-t bg-gray-50 px-4 py-2">
        <div className="flex items-center justify-between text-sm">
          <a href="/" className="text-gray-700 hover:text-green-600 transition-colors">Home</a>
          <a href="/products" className="text-gray-700 hover:text-green-600 transition-colors">Products</a>
          <a href="/categories" className="text-gray-700 hover:text-green-600 transition-colors">Categories</a>
          <a href="/brands" className="text-gray-700 hover:text-green-600 transition-colors">Brands</a>
          <a href="/wishlist" className="text-gray-700 hover:text-green-600 transition-colors">Wishlist</a>
        </div>
      </div>
    </nav>
  );
}

