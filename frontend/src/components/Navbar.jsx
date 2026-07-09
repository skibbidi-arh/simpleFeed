import { getAvatarColor } from './PostCard';

export default function Navbar({ user, onLogout }) {
  const initial = user?.email?.charAt(0).toUpperCase() || '?';
  const color = getAvatarColor(user?.email || '');

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-logo">SimpleFeed</div>

        <div className="navbar-right">
          <div className="navbar-user">
            <div
              className="navbar-avatar"
              style={{ background: color }}
            >
              {initial}
            </div>
            <span className="navbar-email">{user?.email}</span>
          </div>

          <button
            id="logout-btn"
            className="navbar-logout"
            onClick={onLogout}
          >
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
}
