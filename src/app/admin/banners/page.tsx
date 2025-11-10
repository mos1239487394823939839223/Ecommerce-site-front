"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminRouteGuard from "@/components/admin/AdminRouteGuard";
import BannersTable from "@/components/admin/BannersTable";
import BannerForm from "@/components/admin/BannerForm";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { adminApi } from "@/services/adminApi";
import { FaPlus, FaTimes } from "react-icons/fa";

interface Banner {
  _id: string;
  name: string;
  image: string;
  link: string;
  isActive?: boolean;
  order?: number;
  createdAt?: string;
}

function BannersManagementContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [deleteBanner, setDeleteBanner] = useState<Banner | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllBanners();
      console.log('Banners response:', response);
      setBanners(response?.data || []);
    } catch (error) {
      console.error("Error fetching banners:", error);
      alert("Failed to load banners. Please make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingBanner(null);
    setShowForm(true);
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setShowForm(true);
  };

  const handleDelete = (banner: Banner) => {
    setDeleteBanner(banner);
  };

  const confirmDelete = async () => {
    if (!deleteBanner) return;

    try {
      await adminApi.deleteBanner(deleteBanner._id);
      setBanners(banners.filter((b) => b._id !== deleteBanner._id));
      setDeleteBanner(null);
      alert('Banner deleted successfully!');
    } catch (error) {
      console.error("Error deleting banner:", error);
      alert("Failed to delete banner");
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      setFormLoading(true);
      console.log('Submitting banner data:', data);
      
      if (editingBanner) {
        console.log('Updating banner:', editingBanner._id);
        const response = await adminApi.updateBanner(editingBanner._id, data);
        console.log('Update response:', response);
        alert('Banner updated successfully!');
      } else {
        console.log('Creating new banner');
        const response = await adminApi.createBanner(data);
        console.log('Create response:', response);
        alert('Banner created successfully!');
      }
      
      setShowForm(false);
      setEditingBanner(null);
      await fetchData(); // Refresh list
    } catch (error: any) {
      console.error("Error saving banner:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      alert(`Failed to save banner: ${error.message || 'Unknown error'}\n\nCheck console for details.`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBanner(null);
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
                <h1 className="text-2xl font-bold text-gray-900">Banners Management</h1>
                <p className="text-gray-600 mt-1">Manage your homepage banner carousel</p>
              </div>
              {!showForm && (
                <button
                  onClick={handleCreate}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FaPlus className="w-4 h-4" />
                  Add Banner
                </button>
              )}
            </div>

            {/* Form or Table */}
            {showForm ? (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingBanner ? "Edit Banner" : "Create New Banner"}
                  </h2>
                  <button
                    onClick={handleCancel}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
                <BannerForm
                  banner={editingBanner || undefined}
                  onSubmit={handleFormSubmit}
                  onCancel={handleCancel}
                  loading={formLoading}
                />
              </div>
            ) : (
              <BannersTable
                banners={banners}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
              isOpen={!!deleteBanner}
              title="Delete Banner"
              message={`Are you sure you want to delete "${deleteBanner?.name}"? This action cannot be undone.`}
              confirmText="Delete"
              cancelText="Cancel"
              onConfirm={confirmDelete}
              onCancel={() => setDeleteBanner(null)}
              isDanger={true}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function BannersManagementPage() {
  return (
    <AdminRouteGuard>
      <BannersManagementContent />
    </AdminRouteGuard>
  );
}

