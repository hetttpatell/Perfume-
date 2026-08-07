import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, fetchUserProfile, ensureValidToken } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Initialize auth state synchronously from localStorage so protected routes
  // don't flash-redirect to home on page refresh before hydration completes.
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('lune_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('lune_token') || null);
  const [authRequiredNotice, setAuthRequiredNotice] = useState('');

  // Async: sync latest session, profile & token proactively on mount and tab focus
  useEffect(() => {
    const syncSession = async () => {
      const storedToken = localStorage.getItem('lune_token');
      const storedRefresh = localStorage.getItem('lune_refresh_token');

      if (!storedToken && !storedRefresh) {
        setUser(null);
        setToken(null);
        return;
      }

      // Proactively ensure token is valid (refreshes silently if expired)
      const validToken = await ensureValidToken();
      if (!validToken) {
        if (!localStorage.getItem('lune_token') && !localStorage.getItem('lune_refresh_token')) {
          setUser(null);
          setToken(null);
        }
        return;
      }

      setToken(validToken);

      // Fetch fresh profile details from DB
      const profile = await fetchUserProfile();
      if (profile) {
        let currentStoredUser = null;
        try {
          currentStoredUser = JSON.parse(localStorage.getItem('lune_user') || 'null');
        } catch { currentStoredUser = null; }

        const updatedUser = {
          ...(currentStoredUser || {}),
          role: profile.role || 'customer',
          profile
        };
        setUser(updatedUser);
        localStorage.setItem('lune_user', JSON.stringify(updatedUser));
      }
    };

    syncSession();

    // Re-verify session when returning to tab after a day/hours
    const handleFocus = () => syncSession();
    window.addEventListener('focus', handleFocus);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        syncSession();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Periodic silent refresh check every 10 minutes
    const intervalTimer = setInterval(() => {
      syncSession();
    }, 10 * 60 * 1000);

    const handleLogoutEvent = () => {
      setUser(null);
      setToken(null);
    };
    window.addEventListener('lune:auth_logout', handleLogoutEvent);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('lune:auth_logout', handleLogoutEvent);
      clearInterval(intervalTimer);
    };
  }, []);

  const login = async ({ email, password }) => {
    const res = await loginUser({ email, password });
    if (res.success && res.user) {
      setUser(res.user);
      setToken(res.session?.access_token || 'authenticated');
      setAuthRequiredNotice('');
    }
    return res;
  };

  const register = async ({ email, password, fullName }) => {
    const res = await registerUser({ email, password, fullName });
    if (res.success && res.user) {
      setUser(res.user);
      setToken(res.session?.access_token || 'authenticated');
      setAuthRequiredNotice('');
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('lune_token');
    localStorage.removeItem('lune_refresh_token');
    localStorage.removeItem('lune_user');
    setUser(null);
    setToken(null);
  };

  const promptLoginRequired = (message = 'Please sign in or create an account to continue.') => {
    setAuthRequiredNotice(message);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!user,
        user,
        token,
        login,
        register,
        logout,
        authRequiredNotice,
        setAuthRequiredNotice,
        promptLoginRequired
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
