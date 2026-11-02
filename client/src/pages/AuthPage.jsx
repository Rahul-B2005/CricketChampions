import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { GiCricketBat } from 'react-icons/gi';
import { useAuth } from '../context/AuthContext';
import { errMsg } from '../api/axios';

export default function AuthPage({ mode }) {
  const isReg = mode === 'register';
  const { user, login, register } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/" replace />;
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault(); setErr(''); setBusy(true);
    try { await (isReg ? register(f) : login(f)); nav('/'); }
    catch (x) { setErr(errMsg(x)); } finally { setBusy(false); }
  };
  return (
    <div className="auth">
      <div className="auth-art"><GiCricketBat size={64} /><h1>Plan the squad.<br />Test it before match day.</h1><p>Track your Real Cricket 26 career and simulate any two teams ball by ball.</p></div>
      <form className="auth-form" onSubmit={submit}>
        <h2>{isReg ? 'Create your account' : 'Sign in'}</h2>
        {isReg && <label>Name<input value={f.name} onChange={set('name')} required /></label>}
        <label>Email<input type="email" value={f.email} onChange={set('email')} required /></label>
        <label>Password<input type="password" minLength={6} value={f.password} onChange={set('password')} required /></label>
        {err && <p className="error">{err}</p>}
        <button className="primary" disabled={busy}>{busy ? 'Please wait…' : isReg ? 'Create account' : 'Sign in'}</button>
        <p className="muted">{isReg ? <>Have an account? <Link to="/login">Sign in</Link></> : <>New here? <Link to="/register">Create an account</Link></>}</p>
      </form>
    </div>
  );
}
