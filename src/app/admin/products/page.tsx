"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminRouteGuard from "@/components/admin/AdminRouteGuard";
import ProductsTable from "@/components/admin/ProductsTable";
import ProductForm from "@/components/admin/ProductForm";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { adminApi } from "@/services/adminApi";
import { getCategories, getBrands, Category, Brand, Product } from "@/services/clientApi";
import { FaPlus, FaTimes } from "react-icons/fa";

function ProductsManagementContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes, brandsRes] = await Promise.all([
        adminApi.getAllProducts(),
        adminApi.getAllCategories(),
        adminApi.getAllBrands(),
      ]);

      console.log('Products response:', productsRes);
      console.log('Categories response:', categoriesRes);
      console.log('Brands response:', brandsRes);

      setProducts(productsRes?.data || []);
      setCategories(categoriesRes?.data || []);
      setBrands(brandsRes?.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to load data. Please make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = (product: Product) => {
    setDeleteProduct(product);
  };

  const confirmDelete = async () => {
    if (!deleteProduct) return;

    try {
      await adminApi.deleteProduct(deleteProduct._id);
      setProducts(products.filter((p) => p._id !== deleteProduct._id));
      setDeleteProduct(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      setFormLoading(true);
      console.log('Submitting product data:', data);
      
      if (editingProduct) {
        console.log('Updating product:', editingProduct._id);
        const response = await adminApi.updateProduct(editingProduct._id, data);
        console.log('Update response:', response);
        alert('Product updated successfully!');
      } else {
        console.log('Creating new product');
        const response = await adminApi.createProduct(data);
        console.log('Create response:', response);
        alert('Product created successfully!');
      }
      
      setShowForm(false);
      setEditingProduct(null);
      await fetchData(); // Refresh list
    } catch (error: any) {
      console.error("Error saving product:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      alert(`Failed to save product: ${error.message || 'Unknown error'}\n\nCheck console for details.`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 p-4 lg:p-6">
          <div className="max-w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
                <p className="text-gray-600 mt-1">Manage your products inventory</p>
              </div>
              {!showForm && (
                <button
                  onClick={handleCreate}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FaPlus className="w-4 h-4" />
                  Add Product
                </button>
              )}
            </div>

            {/* Form or Table */}
            {showForm ? (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingProduct ? "Edit Product" : "Create New Product"}
                  </h2>
                  <button
                    onClick={handleCancel}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
                <ProductForm
                  product={editingProduct || undefined}
                  categories={categories}
                  brands={brands}
                  onSubmit={handleFormSubmit}
                  onCancel={handleCancel}
                  loading={formLoading}
                />
              </div>
            ) : (
              <ProductsTable
                products={products}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
              isOpen={!!deleteProduct}
              title="Delete Product"
              message={`Are you sure you want to delete "${deleteProduct?.title}"? This action cannot be undone.`}
              confirmText="Delete"
              cancelText="Cancel"
              onConfirm={confirmDelete}
              onCancel={() => setDeleteProduct(null)}
              isDanger={true}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function ProductsManagementPage() {
  return (
    <AdminRouteGuard>
      <ProductsManagementContent />
    </AdminRouteGuard>
  );
}

