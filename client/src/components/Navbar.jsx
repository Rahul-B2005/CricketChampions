import { NavLink } from 'react-router-dom';
import { FiGrid, FiUsers, FiShield, FiList, FiPlay, FiLogOut } from 'react-icons/fi';
import { GiCricketBat } from 'react-icons/gi';
import { useAuth } from '../context/AuthContext';
const links = [
  ['/', 'Dashboard', FiGrid], ['/players', 'Players', FiUsers], ['/teams', 'Teams', FiShield],
  ['/matches', 'Matches', FiList], ['/international', 'International', FiPlay], ['/simulator', 'Simulator', FiPlay],
];
export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="nav">
      <div className="brand"><GiCricketBat size={26} /><span>RC26 Companion</span></div>
      <div className="nav-links">
        {links.map(([to, label, Icon]) => (
          <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
            <Icon /> <span>{label}</span>
          </NavLink>
        ))}
      </div>
      <div className="nav-user">
        <small>{user.name}</small>
        <button className="ghost" onClick={logout}><FiLogOut /> Sign out</button>
      </div>
    </nav>
  );
}
