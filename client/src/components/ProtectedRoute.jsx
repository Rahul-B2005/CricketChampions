import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return <p className="center-note">Loading your squad…</p>;
  if (!user) return <Navigate to="/login" replace />;
  return <div className="shell"><Navbar /><main className="main"><Outlet /></main></div>;
}
