// Backend API configuration
// You can change this via NEXT_PUBLIC_API_BASE_URL environment variable
const BACKEND_API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

// Helper function to get auth token from localStorage
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

// Helper function for authenticated requests to backend API
async function authenticatedRequest(
  path: string,
  options: RequestInit = {}
): Promise<any> {
  try {
    const token = getAuthToken();
    
    const res = await fetch(`${BACKEND_API_BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      let errorMessage = `Request failed ${res.status}`;
      let errorDetails = "";

      try {
        const errorData = await res.json();
        errorDetails = errorData.message || errorData.error || "";
      } catch (e) {
        const text = await res.text().catch(() => "");
        errorDetails = text;
      }

      if (errorDetails) {
        errorMessage += `: ${errorDetails}`;
      }

      throw new Error(errorMessage);
    }

    return res.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("Network error: Unable to connect to server");
    }
    throw error;
  }
}

export const adminApi = {
  // Products Management
  getAllProducts: () => authenticatedRequest("/products"),
  getProduct: (id: string) => authenticatedRequest(`/products/${id}`),
  createProduct: (data: any) =>
    authenticatedRequest("/products", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateProduct: (id: string, data: any) =>
    authenticatedRequest(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteProduct: (id: string) =>
    authenticatedRequest(`/products/${id}`, {
      method: "DELETE",
    }),

  // Orders Management
  getAllOrders: () => authenticatedRequest("/orders"),
  getOrder: (id: string) => authenticatedRequest(`/orders/${id}`),
  updateOrderStatus: (id: string, status: string) =>
    authenticatedRequest(`/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify({ orderStatus: status }),
    }),

  // Users Management
  getAllUsers: () => authenticatedRequest("/users"),
  getUser: (id: string) => authenticatedRequest(`/users/${id}`),
  createUser: (data: any) =>
    authenticatedRequest("/users", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateUser: (id: string, data: any) =>
    authenticatedRequest(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteUser: (id: string) =>
    authenticatedRequest(`/users/${id}`, {
      method: "DELETE",
    }),
  toggleUserActive: (id: string) =>
    authenticatedRequest(`/users/${id}/toggle-active`, {
      method: "PUT",
    }),

  // Categories Management
  getAllCategories: () => authenticatedRequest("/categories"),
  getCategory: (id: string) => authenticatedRequest(`/categories/${id}`),
  createCategory: (data: any) =>
    authenticatedRequest("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateCategory: (id: string, data: any) =>
    authenticatedRequest(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteCategory: (id: string) =>
    authenticatedRequest(`/categories/${id}`, {
      method: "DELETE",
    }),

  // Brands Management
  getAllBrands: () => authenticatedRequest("/brands"),
  getBrand: (id: string) => authenticatedRequest(`/brands/${id}`),
  createBrand: (data: any) =>
    authenticatedRequest("/brands", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateBrand: (id: string, data: any) =>
    authenticatedRequest(`/brands/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteBrand: (id: string) =>
    authenticatedRequest(`/brands/${id}`, {
      method: "DELETE",
    }),

  // Subcategories Management
  getAllSubcategories: () => authenticatedRequest("/subcategories"),
  getSubcategory: (id: string) => authenticatedRequest(`/subcategories/${id}`),
  createSubcategory: (data: any) =>
    authenticatedRequest("/subcategories", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateSubcategory: (id: string, data: any) =>
    authenticatedRequest(`/subcategories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteSubcategory: (id: string) =>
    authenticatedRequest(`/subcategories/${id}`, {
      method: "DELETE",
    }),

  // Dashboard Statistics
  getDashboardStats: () => authenticatedRequest("/dashboard/stats"),

  // Banners Management
  getAllBanners: () => authenticatedRequest("/banners"),
  getBanner: (id: string) => authenticatedRequest(`/banners/${id}`),
  createBanner: (data: any) =>
    authenticatedRequest("/banners", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateBanner: (id: string, data: any) =>
    authenticatedRequest(`/banners/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteBanner: (id: string) =>
    authenticatedRequest(`/banners/${id}`, {
      method: "DELETE",
    }),
};

