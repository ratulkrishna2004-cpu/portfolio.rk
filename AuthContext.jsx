import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);
const DEV_PASSWORD = '092418';

export function AuthProvider({ children }) {
  const [isDevMode, setIsDevMode] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const login = (pass) => {
    if (pass === DEV_PASSWORD) {
      setIsDevMode(true);
      setShowLogin(false);
      return true;
    }
    return false;
  };

  const logout = () => setIsDevMode(false);

  return (
    <AuthContext.Provider value={{ isDevMode, login, logout, showLogin, setShowLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
