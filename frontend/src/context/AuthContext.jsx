import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const defaultUser = {
  id: "demo-user",
  fullName: "Nabila Sultana",
  email: "user@enterprise.local",
  role: "ADMIN",
  department: "IT Security",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(defaultUser);
  const [token, setToken] = useState(localStorage.getItem("sep_token") || "demo-token");

  const login = (nextToken, nextUser) => {
    localStorage.setItem("sep_token", nextToken);
    setToken(nextToken);
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem("sep_token");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      login,
      logout,
      setUser,
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

