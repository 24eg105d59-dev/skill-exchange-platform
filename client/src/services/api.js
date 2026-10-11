const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }
  return data;
};

export const api = {
  // Auth
  login: async (credentials) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return handleResponse(res);
  },

  register: async (userData) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse(res);
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Matches & Explore
  getReciprocalMatches: async () => {
    const res = await fetch(`${API_BASE}/match/reciprocal`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  exploreSkills: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/match/explore?${query}`);
    return handleResponse(res);
  },

  // Requests
  getRequests: async () => {
    const res = await fetch(`${API_BASE}/requests`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  sendRequest: async (requestData) => {
    const res = await fetch(`${API_BASE}/requests`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(requestData)
    });
    return handleResponse(res);
  },

  respondRequest: async (id, status) => {
    const res = await fetch(`${API_BASE}/requests/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    return handleResponse(res);
  },

  // Sessions
  getSessions: async () => {
    const res = await fetch(`${API_BASE}/sessions`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  completeSession: async (id) => {
    const res = await fetch(`${API_BASE}/sessions/${id}/complete`, {
      method: 'PATCH',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  cancelSession: async (id) => {
    const res = await fetch(`${API_BASE}/sessions/${id}/cancel`, {
      method: 'PATCH',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Reviews
  submitReview: async (reviewData) => {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(reviewData)
    });
    return handleResponse(res);
  },

  getUserReviews: async (userId) => {
    const res = await fetch(`${API_BASE}/reviews/user/${userId}`);
    return handleResponse(res);
  },

  // Users & Progress
  getUserProfile: async (id) => {
    const res = await fetch(`${API_BASE}/users/${id}`);
    return handleResponse(res);
  },

  updateProfile: async (updates) => {
    const res = await fetch(`${API_BASE}/users/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates)
    });
    return handleResponse(res);
  },

  getProgress: async () => {
    const res = await fetch(`${API_BASE}/users/progress/summary`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Notifications
  getNotifications: async () => {
    const res = await fetch(`${API_BASE}/notifications`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  markNotificationRead: async (id) => {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  markAllNotificationsRead: async () => {
    const res = await fetch(`${API_BASE}/notifications/read-all`, {
      method: 'PATCH',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Admin & Reports
  fileReport: async (reportData) => {
    const res = await fetch(`${API_BASE}/admin/report`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(reportData)
    });
    return handleResponse(res);
  },

  getAdminStats: async () => {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  getAdminUsers: async () => {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  toggleUserStatus: async (userId) => {
    const res = await fetch(`${API_BASE}/admin/users/${userId}/status`, {
      method: 'PATCH',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  getAdminReports: async () => {
    const res = await fetch(`${API_BASE}/admin/reports`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  resolveAdminReport: async (reportId) => {
    const res = await fetch(`${API_BASE}/admin/reports/${reportId}/resolve`, {
      method: 'PATCH',
      headers: getHeaders()
    });
    return handleResponse(res);
  }
};
