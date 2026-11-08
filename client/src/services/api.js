// DevCollab Frontend API Service
// Connects React Client to Express Backend REST APIs

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Helper to get stored auth token
const getAuthHeaders = () => {
  const token = localStorage.getItem('devcollab_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

// Generic safe fetch with timeout (25s to accommodate Render free-tier cold starts)
async function safeFetch(endpoint, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...(options.headers || {})
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Request failed');
    }
    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

export const authAPI = {
  login: async (email, password) => {
    return safeFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  register: async (userData) => {
    return safeFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  getProfile: async () => {
    return safeFetch('/auth/me');
  }
};

export const projectsAPI = {
  getAll: async (search = '', category = 'All') => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category && category !== 'All') params.append('category', category);

    const query = params.toString() ? `?${params.toString()}` : '';
    return safeFetch(`/projects${query}`);
  },

  getById: async (id) => {
    return safeFetch(`/projects/${id}`);
  },

  create: async (projectData) => {
    return safeFetch('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData)
    });
  },

  update: async (id, projectData) => {
    return safeFetch(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData)
    });
  },

  delete: async (id) => {
    return safeFetch(`/projects/${id}`, {
      method: 'DELETE'
    });
  }
};

export const applicationsAPI = {
  submit: async (applicationData) => {
    return safeFetch('/applications', {
      method: 'POST',
      body: JSON.stringify(applicationData)
    });
  },

  getMyApplications: async (email) => {
    const query = email ? `?email=${encodeURIComponent(email)}` : '';
    return safeFetch(`/applications/my${query}`);
  }
};
