import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, fetchUserProfile } from '../services/api';

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

  // Async: sync latest profile & role from the database after mount
  useEffect(() => {
    if (!token || !user) return;

    fetchUserProfile().then(profile => {
      if (profile && profile.role) {
        const updatedUser = { ...user, role: profile.role, profile };
        setUser(updatedUser);
        localStorage.setItem('lune_user', JSON.stringify(updatedUser));

        // Also sync the react token state if it got silently refreshed
        const currentToken = localStorage.getItem('lune_token');
        if (currentToken && currentToken !== token) {
          setToken(currentToken);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
