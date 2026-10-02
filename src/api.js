const API_BASE = '/api';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('access_token') || null;
    this.refreshToken = localStorage.getItem('refresh_token') || null;
  }

  setTokens(access, refresh) {
    this.token = access;
    this.refreshToken = refresh;
    if (access) localStorage.setItem('access_token', access);
    if (refresh) localStorage.setItem('refresh_token', refresh);
  }

  clearTokens() {
    this.token = null;
    this.refreshToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config = {
      ...options,
      headers,
    };

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    let response = await fetch(url, config);

    if (response.status === 401 && this.refreshToken && !options._retry) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        config.headers['Authorization'] = `Bearer ${this.token}`;
        response = await fetch(url, config);
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Request failed' }));
      console.error('API Error:', response.status, errorData);
      throw new Error(errorData.detail || errorData.message || JSON.stringify(errorData) || 'Request failed');
    }

    if (response.status === 204) return null;
    return response.json();
  }

  async refreshAccessToken() {
    try {
      const response = await fetch(`${API_BASE}/auth/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: this.refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        this.token = data.access;
        localStorage.setItem('access_token', data.access);
        return true;
      }
    } catch (e) {
      // Refresh failed
    }
    this.clearTokens();
    return false;
  }

  // Products
  getProducts(category) {
    const params = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
    return this.request(`/products/${params}`);
  }

  getCategories() {
    return this.request('/products/categories/');
  }

  createProduct(data) {
    return this.request('/products/', { method: 'POST', body: data });
  }

  updateProduct(id, data) {
    return this.request(`/products/${id}/`, { method: 'PATCH', body: data });
  }

  deleteProduct(id) {
    return this.request(`/products/${id}/`, { method: 'DELETE' });
  }

  // Orders
  getOrders() {
    return this.request('/orders/');
  }

  createOrder(cart, data) {
    return this.request('/orders/', { method: 'POST', body: { cart, ...data } });
  }

  updateOrderStatus(id, status) {
    return this.request(`/orders/${id}/update_status/`, { method: 'PATCH', body: { status } });
  }

  cancelOrder(id) {
    return this.request(`/orders/${id}/cancel/`, { method: 'POST' });
  }

  // Notifications
  getNotifications() {
    return this.request('/notifications/');
  }

  markAllNotificationsRead() {
    return this.request('/notifications/mark_all_read/', { method: 'POST' });
  }

  getUnreadCount() {
    return this.request('/notifications/unread_count/');
  }

  // Auth
  register(data) {
    return this.request('/users/register/', { method: 'POST', body: data });
  }

  login(email, password) {
    return this.request('/users/login/', { method: 'POST', body: { email, password } });
  }

  getCurrentUser() {
    return this.request('/users/me/');
  }

  // Farm info
  getFarmInfo() {
    return this.request('/farm/');
  }
}

export const api = new ApiClient();