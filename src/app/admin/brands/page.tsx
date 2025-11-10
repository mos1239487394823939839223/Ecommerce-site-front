"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminRouteGuard from "@/components/admin/AdminRouteGuard";
import BrandsTable from "@/components/admin/BrandsTable";
import BrandForm from "@/components/admin/BrandForm";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { adminApi } from "@/services/adminApi";
import { Brand } from "@/services/clientApi";
import { FaPlus, FaTimes } from "react-icons/fa";

function BrandsManagementContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [deleteBrand, setDeleteBrand] = useState<Brand | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllBrands();
      console.log('Brands response:', response);
      setBrands(response?.data || []);
    } catch (error) {
      console.error("Error fetching brands:", error);
      alert("Failed to load brands. Please make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingBrand(null);
    setShowForm(true);
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setShowForm(true);
  };

  const handleDelete = (brand: Brand) => {
    setDeleteBrand(brand);
  };

  const confirmDelete = async () => {
    if (!deleteBrand) return;

    try {
      await adminApi.deleteBrand(deleteBrand._id);
      setBrands(brands.filter((b) => b._id !== deleteBrand._id));
      setDeleteBrand(null);
    } catch (error) {
      console.error("Error deleting brand:", error);
      alert("Failed to delete brand");
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      setFormLoading(true);
      console.log('Submitting brand data:', data);
      
      if (editingBrand) {
        console.log('Updating brand:', editingBrand._id);
        const response = await adminApi.updateBrand(editingBrand._id, data);
        console.log('Update response:', response);
        alert('Brand updated successfully!');
      } else {
        console.log('Creating new brand');
        const response = await adminApi.createBrand(data);
        console.log('Create response:', response);
        alert('Brand created successfully!');
      }
      
      setShowForm(false);
      setEditingBrand(null);
      await fetchData(); // Refresh list
    } catch (error: any) {
      console.error("Error saving brand:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      alert(`Failed to save brand: ${error.message || 'Unknown error'}\n\nCheck console for details.`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBrand(null);
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
                <h1 className="text-2xl font-bold text-gray-900">Brands Management</h1>
                <p className="text-gray-600 mt-1">Manage your product brands</p>
              </div>
              {!showForm && (
                <button
                  onClick={handleCreate}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FaPlus className="w-4 h-4" />
                  Add Brand
                </button>
              )}
            </div>

            {/* Form or Table */}
            {showForm ? (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingBrand ? "Edit Brand" : "Create New Brand"}
                  </h2>
                  <button
                    onClick={handleCancel}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
                <BrandForm
                  brand={editingBrand || undefined}
                  onSubmit={handleFormSubmit}
                  onCancel={handleCancel}
                  loading={formLoading}
                />
              </div>
            ) : (
              <BrandsTable
                brands={brands}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
              isOpen={!!deleteBrand}
              title="Delete Brand"
              message={`Are you sure you want to delete "${deleteBrand?.name}"? This action cannot be undone.`}
              confirmText="Delete"
              cancelText="Cancel"
              onConfirm={confirmDelete}
              onCancel={() => setDeleteBrand(null)}
              isDanger={true}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function BrandsManagementPage() {
  return (
    <AdminRouteGuard>
      <BrandsManagementContent />
    </AdminRouteGuard>
  );
}

