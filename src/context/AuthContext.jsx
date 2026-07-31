import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, fetchUserProfile } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authRequiredNotice, setAuthRequiredNotice] = useState('');

  // Hydrate auth state from localStorage on mount & refresh latest user role from DB
  useEffect(() => {
    const storedToken = localStorage.getItem('lune_token');
    const storedUser = localStorage.getItem('lune_user');
    if (storedToken && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsed);

        // Sync latest database profile & role (e.g. admin status)
        fetchUserProfile().then(profile => {
          if (profile && profile.role) {
            const updatedUser = { ...parsed, role: profile.role, profile };
            setUser(updatedUser);
            localStorage.setItem('lune_user', JSON.stringify(updatedUser));
          }
        });
      } catch (err) {
        console.error('Failed to parse stored user data:', err);
      }
    }
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
