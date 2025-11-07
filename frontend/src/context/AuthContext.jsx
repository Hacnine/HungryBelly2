import React, { createContext, useContext, useEffect, useState } from "react";
import { useFetchCurrentUserQuery } from "../store/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Keep a token state so we can re-run the current-user query when login/logout happens.
  const [token, setToken] = useState(() => localStorage.getItem("accessToken"));

  useEffect(() => {
    const onAuthChanged = () => setToken(localStorage.getItem("accessToken"));
    // Custom event fired by Login/Logout flows to notify this provider
    window.addEventListener("authChanged", onAuthChanged);
    return () => window.removeEventListener("authChanged", onAuthChanged);
  }, []);

  const { data: user, isLoading, error } = useFetchCurrentUserQuery(undefined, {
    skip: !token,
  });

  const isAuthenticated = !!user && localStorage.getItem("isAuthenticated") === "true";

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading: isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);