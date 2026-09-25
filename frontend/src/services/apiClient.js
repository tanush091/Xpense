const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const config = {
      ...options,
      headers,
    };

    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const json = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMsg = json?.message || `Request failed with status ${response.status}`;
        const error = new Error(errorMsg);
        error.status = response.status;
        error.response = json;
        throw error;
      }

      // If backend returns standard ApiResponse { success, data, message }
      if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
        return json.data;
      }

      return json;
    } catch (err) {
      // Re-throw with network flag if fetch failed completely
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        const netErr = new Error('Spring Boot backend is unreachable at ' + this.baseUrl);
        netErr.isNetworkError = true;
        throw netErr;
      }
      throw err;
    }
  }

  get(endpoint, params) {
    let url = endpoint;
    if (params) {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, val);
        }
      });
      const queryString = query.toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
    }
    return this.request(url, { method: 'GET' });
  }

  post(endpoint, body) {
    return this.request(endpoint, { method: 'POST', body });
  }

  put(endpoint, body) {
    return this.request(endpoint, { method: 'PUT', body });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  async isHealthy() {
    try {
      const res = await fetch(`${this.baseUrl}/profile`, { method: 'GET' });
      return res.ok;
    } catch {
      return false;
    }
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
