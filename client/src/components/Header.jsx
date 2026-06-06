import { NavLink } from 'react-router-dom';

export default function Header({ lastUpdated }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="logo">
          <span className="logo-pun">PUN</span>
          <span className="logo-sub">팝업나우</span>
        </div>

        <nav className="nav-menu">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-btn${isActive ? ' active' : ''}`}
          >
            HOME
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `nav-btn${isActive ? ' active' : ''}`}
          >
            DASHBOARD
          </NavLink>
        </nav>

        <div className="header-meta">
          <span className="live-badge">
            <span className="live-dot" />
            LIVE
          </span>
          <span className="last-updated">{lastUpdated || '—'}</span>
        </div>
      </div>
    </header>
  );
}
