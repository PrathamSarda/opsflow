export const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';

/**
 * Standard fetch wrapper that handles auth headers and JSON parsing.
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    ...options.headers,
  };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If body is NOT FormData, set JSON Content-Type
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return response;
}

export const authApi = {
  login: async (username, password) => {
    const res = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    return res;
  },

  signup: async (username, password, role) => {
    const res = await request('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ username, password, role }),
    });
    return res;
  },
};

export const productsApi = {
  getAll: async () => {
    const res = await request('/api/products/all');
    return res;
  },

  getById: async (id) => {
    const res = await request(`/api/products/${id}`);
    return res;
  },

  add: async (formData) => {
    const res = await request('/api/products/add', {
      method: 'POST',
      body: formData,
    });
    return res;
  },

  update: async (id, productData) => {
    const res = await request(`/api/products/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
    return res;
  },

  updateImage: async (id, formData) => {
    const res = await request(`/api/products/update/${id}/image`, {
      method: 'POST',
      body: formData,
    });
    return res;
  },

  delete: async (id) => {
    const res = await request(`/api/products/delete/${id}`, {
      method: 'DELETE',
    });
    return res;
  },
};

export const ordersApi = {
  getAll: async () => {
    const res = await request('/api/orders/all');
    return res;
  },

  getByCustomer: async (username) => {
    const res = await request(`/api/orders/customer/${encodeURIComponent(username)}`);
    return res;
  },

  checkout: async (orderData) => {
    const res = await request('/api/orders/checkout', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
    return res;
  },

  updateStatus: async (id, status) => {
    const res = await request(`/api/orders/status/${id}?status=${encodeURIComponent(status)}`, {
      method: 'PUT',
    });
    return res;
  },
};
