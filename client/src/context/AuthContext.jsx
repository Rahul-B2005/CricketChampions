import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!localStorage.getItem('rc26_token'));
  const logout = useCallback(() => { localStorage.removeItem('rc26_token'); setUser(null); }, []);

  useEffect(() => {
    if (!localStorage.getItem('rc26_token')) return;
    api.get('/auth/me').then((r) => setUser(r.data.user)).catch(logout).finally(() => setLoading(false));
  }, [logout]);
  useEffect(() => { window.addEventListener('rc26-logout', logout); return () => window.removeEventListener('rc26-logout', logout); }, [logout]);

  const authenticate = async (path, body) => {
    const { data } = await api.post(`/auth/${path}`, body);
    localStorage.setItem('rc26_token', data.token);
    setUser(data.user);
  };
  return (
    <Ctx.Provider value={{ user, loading, logout, login: (b) => authenticate('login', b), register: (b) => authenticate('register', b) }}>
      {children}
    </Ctx.Provider>
  );
}
