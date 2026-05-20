import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de réponse pour la gestion globale des erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erreur API:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ─── Produits ────────────────────────────────────────
export const productApi = {
  getAll: () => api.get('/products'),
  create: (product) => api.post('/products', product),
};

// ─── Entrepôts ───────────────────────────────────────
export const warehouseApi = {
  getAll: () => api.get('/warehouses'),
  create: (warehouse) => api.post('/warehouses', warehouse),
};

// ─── Mouvements de stock ─────────────────────────────
export const movementApi = {
  create: (movement) => api.post('/movements', movement),
  getRecent: () => api.get('/movements'),
};

// ─── Stock courant ───────────────────────────────────
export const stockApi = {
  getCurrent: (productId, warehouseId) =>
    api.get('/stock/current', { params: { productId, warehouseId } }),
};

export default api;
