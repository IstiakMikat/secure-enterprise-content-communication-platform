import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() =>
    sessionStorage.getItem("sep_auth_active") || null
  );
  const [pendingAuth, setPendingAuth] = useState(() => {
    const raw = sessionStorage.getItem("sep_pending_auth");
    return raw ? JSON.parse(raw) : null;
  });
  const [isBootstrapping, setIsBootstrapping] = useState(
    Boolean(sessionStorage.getItem("sep_auth_active"))
  );

  const login = (nextToken, nextUser = null) => {
    sessionStorage.setItem("sep_auth_active", "1");
    setToken(nextToken || "cookie");
    if (nextUser) {
      setUser(nextUser);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("sep_auth_active");
    sessionStorage.removeItem("sep_pending_auth");
    setToken(null);
    setUser(null);
    setPendingAuth(null);
  };

  const setPending = (payload) => {
    if (!payload) {
      sessionStorage.removeItem("sep_pending_auth");
      setPendingAuth(null);
      return;
    }

    sessionStorage.setItem("sep_pending_auth", JSON.stringify(payload));
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
        sessionStorage.removeItem("sep_auth_active");
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
