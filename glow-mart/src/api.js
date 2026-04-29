// api.js - CLEAN VERSION
import axios from "axios";

// ✅ Always use env variable (fallback only for local dev)
const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:8000/api";

console.log("🔗 API_BASE:", API_BASE);

// -------------------- AXIOS INSTANCES --------------------
const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const publicApi = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// -------------------- HELPERS --------------------
const getCSRFToken = () => {
  const name = "csrftoken";
  let cookieValue = null;

  if (document.cookie) {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

// -------------------- REQUEST INTERCEPTOR --------------------
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.method !== "get") {
      const csrfToken = getCSRFToken();
      if (csrfToken) {
        config.headers["X-CSRFToken"] = csrfToken;
      }
    }

    console.log(`📤 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);

    return config;
  },
  (error) => Promise.reject(error)
);

// -------------------- RESPONSE INTERCEPTOR --------------------
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        try {
          const response = await axios.post(
            `${API_BASE}/user/token/refresh/`,
            { refresh: refreshToken }
          );

          if (response.data.access) {
            localStorage.setItem("access_token", response.data.access);
            originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
            return api(originalRequest);
          }
        } catch (err) {
          console.error("Token refresh failed:", err);
        }
      }

      // logout fallback
      localStorage.clear();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// -------------------- AUTH --------------------
export const login = async (username, password) => {
  const response = await publicApi.post("/user/token/", {
    username,
    password,
  });

  if (response.data.access) {
    localStorage.setItem("access_token", response.data.access);
    localStorage.setItem("refresh_token", response.data.refresh);

    localStorage.setItem(
      "user",
      JSON.stringify({
        username,
        user_id: response.data.user_id,
        isAuthenticated: true,
      })
    );
  }

  return response.data;
};

export const logout = () => {
  localStorage.clear();
  window.location.href = "/login";
};

export const checkAuth = async () => {
  try {
    await api.get("/user/me/");
    return true;
  } catch {
    return false;
  }
};

// -------------------- INVENTORY --------------------
export const getProducts = () => api.get("/inventory/products/");
export const getPublicProducts = () =>
  publicApi.get("/inventory/public/products/");
export const getProduct = (id) =>
  api.get(`/inventory/products/${id}/`);
export const createProduct = (data) =>
  api.post("/inventory/products/", data);
export const updateProduct = (id, data) =>
  api.put(`/inventory/products/${id}/`, data);
export const deleteProduct = (id) =>
  api.delete(`/inventory/products/${id}/`);

// -------------------- CATEGORIES --------------------
export const getCategories = () =>
  api.get("/inventory/categories/");
export const getPublicCategories = () =>
  publicApi.get("/inventory/public/categories/");
export const createCategory = (data) =>
  api.post("/inventory/categories/", data);
export const updateCategory = (id, data) =>
  api.put(`/inventory/categories/${id}/`, data);
export const deleteCategory = (id) =>
  api.delete(`/inventory/categories/${id}/`);

// -------------------- SUPPLIERS --------------------
export const getSuppliers = () =>
  api.get("/inventory/suppliers/");
export const createSupplier = (data) =>
  api.post("/inventory/suppliers/", data);
export const updateSupplier = (id, data) =>
  api.put(`/inventory/suppliers/${id}/`, data);
export const deleteSupplier = (id) =>
  api.delete(`/inventory/suppliers/${id}/`);

// -------------------- ORDERS --------------------
export const getOrders = () => api.get("/orders/");
export const getOrder = (id) => api.get(`/orders/${id}/`);
export const createOrder = (data) => api.post("/orders/", data);
export const updateOrder = (id, data) =>
  api.patch(`/orders/${id}/`, data);
export const deleteOrder = (id) =>
  api.delete(`/orders/${id}/`);

// -------------------- STOCK --------------------
export const checkStock = (productId, quantity) =>
  api.get(`/inventory/products/${productId}/check-stock/`, {
    params: { quantity },
  });

export default api;