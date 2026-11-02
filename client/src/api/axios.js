import axios from 'axios';
// Talks to the RC26 API directly, so it works no matter which dev server serves the page.
// Works with both Vite (VITE_API_URL) and Create React App (REACT_APP_API_URL)
const viteEnv = (typeof import.meta !== 'undefined' && import.meta.env) || {};
const craUrl = typeof process !== 'undefined' ? process.env.REACT_APP_API_URL : undefined;
export const API_URL = viteEnv.VITE_API_URL || craUrl || 'http://localhost:5055/api';
const api = axios.create({ baseURL: API_URL });
api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem('rc26_token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});
api.interceptors.response.use((r) => r, (err) => {
  if (err.response?.status === 401 && localStorage.getItem('rc26_token')) {
    localStorage.removeItem('rc26_token');
    window.dispatchEvent(new Event('rc26-logout'));
  }
  return Promise.reject(err);
});
export const errMsg = (e) => {
  if (e.response?.data?.message) return e.response.data.message;
  if (!e.response) return `Cannot reach the API at ${API_URL}. Start the server (npm run dev) and check MongoDB.`;
  if (e.response.status === 404) return `404 from ${API_URL}. Another app is using that port, or the RC26 server is not the one running.`;
  return e.message || 'Something went wrong';
};
export default api;
