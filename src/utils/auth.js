// Authentication utilities
export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

export const getToken = () => {
  return localStorage.getItem('authToken');
};

export const getUser = () => {
  const userString = localStorage.getItem('user');
  return userString ? JSON.parse(userString) : null;
};

export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

// Helper to set auth header in axios requests
export const setAuthHeader = (axios) => {
  const token = getToken();
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
  return axios;
}; 