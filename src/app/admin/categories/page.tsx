"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminRouteGuard from "@/components/admin/AdminRouteGuard";
import CategoriesTable from "@/components/admin/CategoriesTable";
import CategoryForm from "@/components/admin/CategoryForm";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { adminApi } from "@/services/adminApi";
import { Category } from "@/services/clientApi";
import { FaPlus, FaTimes } from "react-icons/fa";

function CategoriesManagementContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllCategories();
      console.log('Categories response:', response);
      setCategories(response?.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("Failed to load categories. Please make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = (category: Category) => {
    setDeleteCategory(category);
  };

  const confirmDelete = async () => {
    if (!deleteCategory) return;

    try {
      await adminApi.deleteCategory(deleteCategory._id);
      setCategories(categories.filter((c) => c._id !== deleteCategory._id));
      setDeleteCategory(null);
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category");
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      setFormLoading(true);
      console.log('Submitting category data:', data);
      
      if (editingCategory) {
        console.log('Updating category:', editingCategory._id);
        const response = await adminApi.updateCategory(editingCategory._id, data);
        console.log('Update response:', response);
        alert('Category updated successfully!');
      } else {
        console.log('Creating new category');
        const response = await adminApi.createCategory(data);
        console.log('Create response:', response);
        alert('Category created successfully!');
      }
      
      setShowForm(false);
      setEditingCategory(null);
      await fetchData(); // Refresh list
    } catch (error: any) {
      console.error("Error saving category:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      alert(`Failed to save category: ${error.message || 'Unknown error'}\n\nCheck console for details.`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
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
                <h1 className="text-2xl font-bold text-gray-900">Categories Management</h1>
                <p className="text-gray-600 mt-1">Manage your product categories</p>
              </div>
              {!showForm && (
                <button
                  onClick={handleCreate}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FaPlus className="w-4 h-4" />
                  Add Category
                </button>
              )}
            </div>

            {/* Form or Table */}
            {showForm ? (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingCategory ? "Edit Category" : "Create New Category"}
                  </h2>
                  <button
                    onClick={handleCancel}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
                <CategoryForm
                  category={editingCategory || undefined}
                  onSubmit={handleFormSubmit}
                  onCancel={handleCancel}
                  loading={formLoading}
                />
              </div>
            ) : (
              <CategoriesTable
                categories={categories}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
              isOpen={!!deleteCategory}
              title="Delete Category"
              message={`Are you sure you want to delete "${deleteCategory?.name}"? This action cannot be undone.`}
              confirmText="Delete"
              cancelText="Cancel"
              onConfirm={confirmDelete}
              onCancel={() => setDeleteCategory(null)}
              isDanger={true}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function CategoriesManagementPage() {
  return (
    <AdminRouteGuard>
      <CategoriesManagementContent />
    </AdminRouteGuard>
  );
}

