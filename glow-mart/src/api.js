// // api.js - JWT Authentication
// import axios from "axios";

// const API_BASE =
//   import.meta.env.VITE_API_BASE || "https://glow-mart-backend-1.onrender.com/api";

// // Helper to get CSRF token
// const getCSRFToken = () => {
//   const name = 'csrftoken';
//   let cookieValue = null;
//   if (document.cookie && document.cookie !== '') {
//     const cookies = document.cookie.split(';');
//     for (let i = 0; i < cookies.length; i++) {
//       const cookie = cookies[i].trim();
//       if (cookie.substring(0, name.length + 1) === (name + '=')) {
//         cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//         break;
//       }
//     }
//   }
//   return cookieValue;
// };

// // Create axios instance
// const api = axios.create({
//   baseURL: API_BASE,
//   timeout: 30000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true,
// });

// // Request interceptor - ADD JWT TOKEN
// api.interceptors.request.use(
//   (config) => {
//     // Get token from localStorage
//     const token = localStorage.getItem('access_token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
    
//     // Add CSRF token for non-GET requests
//     if (config.method !== 'get') {
//       const csrfToken = getCSRFToken();
//       if (csrfToken) {
//         config.headers['X-CSRFToken'] = csrfToken;
//       }
//     }
    
//     console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`, {
//       hasAuth: !!config.headers.Authorization,
//       hasCSRF: !!config.headers['X-CSRFToken']
//     });
    
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor - handle 401 by refreshing token
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
    
//     // CRITICAL FIX: Ignore OPTIONS/preflight requests - they always get 401 but shouldn't redirect
//     if (originalRequest.method === 'options' || originalRequest.method === 'OPTIONS') {
//       return Promise.reject(error);
//     }
    
//     // Also ignore public endpoints that don't need auth
//     const isPublicEndpoint = originalRequest.url?.includes('/inventory/public/') || 
//                               originalRequest.url?.includes('/user/token/') ||
//                               originalRequest.url?.includes('/user/me/');
    
//     // Handle 401 Unauthorized responses
//     if (error.response?.status === 401 && !originalRequest._retry && !isPublicEndpoint) {
//       originalRequest._retry = true;
      
//       const refreshToken = localStorage.getItem('refresh_token');
//       if (refreshToken) {
//         try {
//           const response = await axios.post(`${API_BASE}/user/token/refresh/`, {
//             refresh: refreshToken
//           });
          
//           if (response.data.access) {
//             localStorage.setItem('access_token', response.data.access);
//             originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
//             return api(originalRequest);
//           }
//         } catch (refreshError) {
//           console.error('Token refresh failed:', refreshError);
//         }
//       }
      
//       // Clear auth data and redirect to login (only for non-public endpoints)
//       localStorage.removeItem('access_token');
//       localStorage.removeItem('refresh_token');
//       localStorage.removeItem('user');
      
//       // Only redirect if not already on login page
//       if (!window.location.pathname.includes('/login')) {
//         window.location.href = '/login';
//       }
//     }
    
//     return Promise.reject(error);
//   }
// );

// // Public API instance (no auth)
// export const publicApi = axios.create({
//   baseURL: API_BASE,
//   timeout: 30000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//    withCredentials: true,
// });

// // -------------------- AUTHENTICATION --------------------
// export const login = async (username, password) => {
//   try {
//     // Use the JWT token endpoint
//     const response = await publicApi.post('/user/token/', { 
//       username, 
//       password 
//     });
    
//     console.log('Login response:', response.data);
    
//     if (response.data.access) {
//       // Store JWT tokens
//       localStorage.setItem('access_token', response.data.access);
//       localStorage.setItem('refresh_token', response.data.refresh);
      
//       // Store user info (you might need to fetch this separately)
//       localStorage.setItem('user', JSON.stringify({
//         username: username,
//         is_superuser: true,  // You should fetch this from /user/me/
//         user_id: response.data.user_id,
//         isAuthenticated: true
//       }));
      
//       return { success: true, ...response.data };
//     } else {
//       throw new Error('Invalid response from server');
//     }
//   } catch (error) {
//     console.error('Login error:', error.response?.data || error.message);
//     throw error;
//   }
// };

// export const logout = async () => {
//   localStorage.removeItem('access_token');
//   localStorage.removeItem('refresh_token');
//   localStorage.removeItem('user');
//   localStorage.removeItem('cart');
//   sessionStorage.clear();
//   window.location.href = '/login';
// };

// export const checkAuth = async () => {
//   const token = localStorage.getItem('access_token');
//   if (!token) return false;
  
//   try {
//     // Verify token by calling a protected endpoint
//     await api.get('/user/me/');
//     return true;
//   } catch (error) {
//     console.log('Auth check failed:', error.response?.status);
//     return false;
//   }
// };

// export const isAuthenticated = () => {
//   const token = localStorage.getItem('access_token');
//   if (!token) return false;
  
//   // Check if token is expired
//   try {
//     const payload = JSON.parse(atob(token.split('.')[1]));
//     const expired = payload.exp * 1000 < Date.now();
//     return !expired;
//   } catch {
//     return !!token;
//   }
// };

// export const getUser = () => {
//   const user = localStorage.getItem('user');
//   if (!user) return null;
//   try {
//     return JSON.parse(user);
//   } catch {
//     return null;
//   }
// };

// // -------------------- INVENTORY --------------------
// export const getProducts = () => publicApi.get('/inventory/public/products/');
// export const getPublicProducts = () => publicApi.get('/inventory/public/products/');
// export const getProduct = (id) => api.get(`/inventory/products/${id}/`);
// export const createProduct = (data) => api.post('/inventory/products/', data);
// export const updateProduct = (id, data) => api.put(`/inventory/products/${id}/`, data);
// export const deleteProduct = (id) => api.delete(`/inventory/products/${id}/`);

// // --------------- Category Endpoints -------------------
// export const getCategories = () => publicApi.get('/inventory/public/categories/');
// export const getPublicCategories = () => publicApi.get('/inventory/public/categories/');
// export const createCategory = (data) => api.post('/inventory/categories/', data);
// export const updateCategory = (id, data) => api.put(`/inventory/categories/${id}/`, data);
// export const deleteCategory = (id) => api.delete(`/inventory/categories/${id}/`);

// // --------------- Supplier Endpoints ---------------------
// export const getSuppliers = () => api.get('/inventory/suppliers/');
// export const createSupplier = (data) => api.post('/inventory/suppliers/', data);
// export const updateSupplier = (id, data) => api.put(`/inventory/suppliers/${id}/`, data);
// export const deleteSupplier = (id) => api.delete(`/inventory/suppliers/${id}/`);

// // -------------------- ORDERS --------------------
// export const getOrders = () => api.get('/orders/');
// export const getOrder = (id) => api.get(`/orders/${id}/`);
// export const createOrder = (data) => api.post('/orders/', data);
// export const updateOrder = (id, data) => api.patch(`/orders/${id}/`, data);
// export const deleteOrder = (id) => api.delete(`/orders/${id}/`);

// // -------------------- STOCK CHECK --------------------
// export const checkStock = (productId, quantity) => {
//   return api.get(`/inventory/products/${productId}/check-stock/`, { 
//     params: { quantity } 
//   });
// };

// // export const getLowStockProducts = () => {
// //   return api.get('/inventory/products/', {
// //     params: { stock__lt: 10, stock__gt: 0 }
// //   });
// // };

// // export const getOutOfStockProducts = () => {
// //   return api.get('/inventory/products/', {
// //     params: { stock: 0 }
// //   });
// // };

// export const getLowStockProducts = async () => {
//   const res = await api.get('/inventory/products/');
//   return {
//     ...res,
//     data: res.data.filter(p => p.stock > 0 && p.stock < 10)
//   };
// };

// export const getOutOfStockProducts = async () => {
//   const res = await api.get('/inventory/products/');
//   return {
//     ...res,
//     data: res.data.filter(p => p.stock === 0)
//   };
// };

// export default api;



import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "https://glow-mart-backend-1.onrender.com/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Token management
export const setToken = (accessToken, refreshToken) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
}

export const getAccessToken = () => localStorage.getItem('accessToken');
export const getRefreshToken = () => localStorage.getItem('refreshToken');

export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

// Request interceptor - add token to requests that need auth
api.interceptors.request.use(
  (config) => {
    // Only add token for admin endpoints (not public)
    if (!config.url.includes('/public/')) {
      const token = getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ========== PUBLIC ENDPOINTS (No Auth Required - for normal users) ==========
export const getPublicProducts = () => api.get("/inventory/public/products/");
export const getPublicProduct = (id) => api.get(`/inventory/public/products/${id}/`);
export const getPublicCategories = () => api.get("/inventory/public/categories/");

// ========== MIXED ENDPOINTS (Read public, Write requires auth) ==========
export const getProducts = () => api.get("/inventory/products/");
export const getProduct = (id) => api.get(`/inventory/products/${id}/`);
export const createProduct = (data) => api.post("/inventory/products/", data);
export const updateProduct = (id, data) => api.put(`/inventory/products/${id}/`, data);
export const deleteProduct = (id) => api.delete(`/inventory/products/${id}/`);
export const checkStock = (productId, quantity) => 
  api.get(`/inventory/products/${productId}/check_stock/`, { params: { quantity } });

export const getCategories = () => api.get("/inventory/categories/");
export const getCategory = (id) => api.get(`/inventory/categories/${id}/`);
export const createCategory = (data) => api.post("/inventory/categories/", data);
export const updateCategory = (id, data) => api.put(`/inventory/categories/${id}/`, data);
export const deleteCategory = (id) => api.delete(`/inventory/categories/${id}/`);

export const getSuppliers = () => api.get("/inventory/suppliers/");
export const getSupplier = (id) => api.get(`/inventory/suppliers/${id}/`);
export const createSupplier = (data) => api.post("/inventory/suppliers/", data);
export const updateSupplier = (id, data) => api.put(`/inventory/suppliers/${id}/`, data);
export const deleteSupplier = (id) => api.delete(`/inventory/suppliers/${id}/`);

// ========== AUTH ==========
export const login = async (username, password) => {
  try {
    const response = await api.post("/user/token/", { username, password });
    
    if (response.data.access) {
      localStorage.setItem("accessToken", response.data.access);
    }
    if (response.data.refresh) {
      localStorage.setItem("refreshToken", response.data.refresh);
    }
    
    localStorage.setItem(
      "user",
      JSON.stringify({
        username,
        isAuthenticated: true,
      })
    );

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  localStorage.removeItem("cart");
  sessionStorage.clear();
  window.location.href = "/login";
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  try {
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export default api;

// --------------------------------------------------
// STOCK FILTERS
// --------------------------------------------------
// export const getLowStockProducts = async () => {
//   const res = await api.get("/inventory/products/");
//   return {
//     ...res,
//     data: res.data.filter((p) => p.stock > 0 && p.stock < 10),
//   };
// };

// export const getOutOfStockProducts = async () => {
//   const res = await api.get("/inventory/products/");
//   return {
//     ...res,
//     data: res.data.filter((p) => p.stock === 0),
//   };
// };

// export default api;