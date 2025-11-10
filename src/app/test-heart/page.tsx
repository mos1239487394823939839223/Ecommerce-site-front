"use client";

import { useState } from "react";
import Heart from "@/components/Heart";

export default function TestHeartPage() {
  const [testProducts] = useState([
    { _id: "test1", title: "Test Product 1" },
    { _id: "test2", title: "Test Product 2" },
    { _id: "test3", title: "Test Product 3" },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Heart Icon Test Page</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Instructions:</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Click on any heart icon below</li>
            <li>The heart should turn red when clicked</li>
            <li>You should see a success notification</li>
            <li>Go to the Wish List page to see the added products</li>
          </ol>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-sm p-6 border">
              <div className="relative mb-4">
                <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Product Image</span>
                </div>
                
                {/* Heart Button */}
                <div className="absolute top-2 right-2 z-30">
                  <Heart 
                    productId={product._id}
                    size="md"
                  />
                </div>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2">{product.title}</h3>
              <p className="text-gray-600 text-sm mb-4">Test product description</p>
              <div className="text-lg font-bold text-green-600">$99.99</div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a 
            href="/wishlist" 
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            View Wish List
          </a>
        </div>
      </div>
    </div>
  );
}

