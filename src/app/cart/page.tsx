"use client";

import { useCart } from "@/components/CartProvider";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { cartItems, cartTotal, updateCartItem, removeFromCart, clearCart, loading, refreshCart } = useCart();
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [shippingAddress, setShippingAddress] = useState({
    details: "",
    phone: "",
    city: "",
    postalCode: "12345"
  });

  useEffect(() => {
    console.log('CartPage: Component mounted, cart items:', cartItems.length);
    console.log('CartPage: Cart items details:', cartItems);
    console.log('CartPage: Authentication status:', isAuthenticated);
    console.log('CartPage: User:', user);
    console.log('CartPage: Cart total:', cartTotal);
    console.log('CartPage: Loading state:', loading);
  }, [cartItems, isAuthenticated, user, cartTotal, loading]);

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) return;
    
    try {
      await updateCartItem(productId, newQuantity);
    } catch (error) {
      console.error('Error updating cart:', error);
      alert('Failed to update quantity. Please try again.');
    }
  };

  const handleRemoveFromCart = async (productId: string) => {
    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert('Failed to remove product. Please try again.');
    }
  };

  const handleClearCart = async () => {
    if (!confirm('Are you sure you want to clear the entire cart?')) return;
    
    try {
      await clearCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('Failed to clear cart. Please try again.');
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      alert("Please login to proceed to checkout");
      router.push('/login');
      return;
    }
    
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      alert("Please login to proceed to checkout");
      router.push('/login');
      return;
    }
    
    if (!shippingAddress.details || !shippingAddress.phone || !shippingAddress.city) {
      alert("Please fill in all required shipping address fields before proceeding to checkout.");
      return;
    }
    
    const shippingData = {
      details: shippingAddress.details,
      phone: shippingAddress.phone,
      city: shippingAddress.city,
      postalCode: shippingAddress.postalCode
    };
    
    const queryParams = new URLSearchParams(shippingData);
    router.push(`/payment?${queryParams.toString()}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const handleCartUpdate = () => {
      console.log('CartPage: Cart update event received');
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);
  
  const handleManualRefresh = () => {
    console.log('CartPage: Manual refresh triggered');
    refreshCart();
  };

  if (authLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading cart...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log('CartPage: Rendering with cartItems:', cartItems);
  console.log('CartPage: Cart count:', cartItems.length);
  console.log('CartPage: Cart total:', cartTotal);
  console.log('CartPage: localStorage cart:', JSON.parse(localStorage.getItem('cart') || '[]'));

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Add some products to get started!</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push('/products')}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Continue Shopping
              </button>
              <button
                onClick={handleManualRefresh}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Refresh Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <div className="flex gap-4">
          <button
            onClick={handleManualRefresh}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Refresh Cart
          </button>
          <button
            onClick={handleClearCart}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Clear Cart
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.product._id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-4">
                <img
                  src={item.product.imageCover}
                  alt={item.product.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {item.product.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.product.description}
                  </p>
                  <p className="text-lg font-semibold text-green-600 mt-2">
                    ${item.price.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleUpdateQuantity(item.product._id, item.count - 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    disabled={item.count <= 1}
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium">{item.count}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.product._id, item.count + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold text-gray-900">
                    ${(item.price * item.count).toLocaleString()}
                  </span>
                  <button
                    onClick={() => handleRemoveFromCart(item.product._id)}
                    className="text-red-500 hover:text-red-700 p-2 transition-colors"
                    title="Remove from cart"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            {/* Shipping Address Form */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Shipping Address</h3>
              <div className="space-y-3">
                <div>
                  <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">
                    Address Details
                  </label>
                  <input
                    type="text"
                    id="details"
                    name="details"
                    value={shippingAddress.details}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm"
                    placeholder="Street 12, Apartment 3"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm"
                    placeholder="01012345678"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm"
                    placeholder="Cairo"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">$0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">$0</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-green-600">${cartTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Options */}
            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition-colors text-center block"
              >
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Stripe Checkout
                </div>
              </button>
              
              <button
                onClick={() => {
                  if (!shippingAddress.details || !shippingAddress.phone || !shippingAddress.city) {
                    alert('Please fill in all shipping address fields before proceeding to payment.');
                    return;
                  }
                  const params = new URLSearchParams({
                    details: shippingAddress.details,
                    phone: shippingAddress.phone,
                    city: shippingAddress.city,
                    postalCode: shippingAddress.postalCode
                  });
                  router.push(`/payment/visa?${params.toString()}`);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors text-center block"
              >
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Pay with Visa Card
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

