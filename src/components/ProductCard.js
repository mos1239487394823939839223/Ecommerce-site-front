"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import Heart from "./Heart";

export default function ProductCard({ product }) {
  const router = useRouter();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCart(); // Use CartProvider instead of direct API

  const handleCardClick = () => {
    router.push(`/products/${product._id}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // Prevent card click navigation
    
    try {
      setIsAddingToCart(true);
      
      console.log('ProductCard: Adding product to cart', { productId: product._id });
      
      // Use CartProvider's addToCart function
      await addToCart(product._id, 1);
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
      notification.textContent = 'Product added to cart successfully! 🛒';
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 300);
      }, 2000);
      
    } catch (error) {
      console.error('ProductCard: Error adding to cart:', error);
      alert('Failed to add product to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group cursor-pointer"
    >
      <div className="relative">
        {product.discount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
            -{product.discount}%
          </div>
        )}
        <img 
          src={product.imageCover || "/placeholder.svg"} 
          alt={product.title} 
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
        />
        <Heart 
          productId={product._id}
          className="absolute top-3 right-3"
          size="md"
        />
      </div>
      
      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">{product.title}</h3>
          <p className="text-sm text-gray-500">{product.category?.name}</p>
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">{product.price || 0} EGP</span>
            {product.priceAfterDiscount && (
              <span className="text-sm text-gray-500 line-through">{product.priceAfterDiscount || 0} EGP</span>
            )}
          </div>
          <button 
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isAddingToCart 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600'
            } text-white`}
          >
            {isAddingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}


