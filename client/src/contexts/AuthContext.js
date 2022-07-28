import { createContext, useState, useContext, useEffect, useCallback } from 'react';

const AuthContext = createContext();

const defaultData = localStorage.getItem('isAuthenticated') === 'true' ? true : false;

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(defaultData);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    window.location.reload();
  }, []);

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);

  const values = {
    isAuthenticated,
    setIsAuthenticated,
    logout,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }

  return context;
};
