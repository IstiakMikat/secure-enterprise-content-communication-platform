import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("sep_token"));
  const [pendingAuth, setPendingAuth] = useState(() => {
    const raw = localStorage.getItem("sep_pending_auth");
    return raw ? JSON.parse(raw) : null;
  });
  const [isBootstrapping, setIsBootstrapping] = useState(Boolean(localStorage.getItem("sep_token")));

  const login = (nextToken, nextUser) => {
    localStorage.setItem("sep_token", nextToken);
    setToken(nextToken);
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem("sep_token");
    localStorage.removeItem("sep_pending_auth");
    setToken(null);
    setUser(null);
    setPendingAuth(null);
  };

  const setPending = (payload) => {
    if (!payload) {
      localStorage.removeItem("sep_pending_auth");
      setPendingAuth(null);
      return;
    }

    localStorage.setItem("sep_pending_auth", JSON.stringify(payload));
    setPendingAuth(payload);
  };

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setIsBootstrapping(false);
        return;
      }

      try {
        const currentUser = await authApi.me();
        setUser(currentUser);
      } catch (_error) {
        localStorage.removeItem("sep_token");
        setToken(null);
        setUser(null);
      } finally {
        setIsBootstrapping(false);
      }
    };

    bootstrap();
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      login,
      logout,
      setUser,
      pendingAuth,
      setPendingAuth: setPending,
      isBootstrapping,
    }),
    [user, token, pendingAuth, isBootstrapping]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
