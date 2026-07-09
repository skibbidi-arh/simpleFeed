import { useState, useEffect, useCallback } from 'react';
import { getToken, clearToken, getMe } from './api';
import AuthPage from './components/AuthPage';
import Navbar from './components/Navbar';
import Feed from './components/Feed';
import UploadModal from './components/UploadModal';

export default function App() {
  const [authenticated, setAuthenticated] = useState(!!getToken());
  const [user, setUser] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchUser = useCallback(async () => {
    try {
      const me = await getMe();
      setUser(me);
    } catch {
      // Token is invalid or expired
      clearToken();
      setAuthenticated(false);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchUser();
    }
  }, [authenticated, fetchUser]);

  const handleAuth = () => {
    setAuthenticated(true);
  };

  const handleLogout = () => {
    clearToken();
    setAuthenticated(false);
    setUser(null);
  };

  const handleUploaded = () => {
    setRefreshKey((k) => k + 1);
  };

  if (!authenticated) {
    return <AuthPage onAuth={handleAuth} />;
  }

  return (
    <div>
      <Navbar user={user} onLogout={handleLogout} />
      <Feed refreshKey={refreshKey} />
      <UploadModal onUploaded={handleUploaded} />
    </div>
  );
}
