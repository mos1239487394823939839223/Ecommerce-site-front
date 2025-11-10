"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCategories, Category } from "@/services/clientApi";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/products?category=${categoryId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Categories</h1>
            <p className="text-gray-600">Loading categories...</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array(10).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-6 rounded w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Categories</h1>
          <p className="text-gray-600">{categories.length} categories available</p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {categories.map((category) => (
            <div
              key={category._id}
              onClick={() => handleCategoryClick(category._id)}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer group"
            >
              {/* Category Image */}
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={category.image || '/placeholder-image.jpg'}
                  alt={category.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>

              {/* Category Name */}
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-green-600 group-hover:text-green-700 transition-colors">
                  {category.name}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {categories.length === 0 && !loading && (
          <div className="text-center py-12">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600 mb-6">There are no categories available at the moment</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Refresh Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

