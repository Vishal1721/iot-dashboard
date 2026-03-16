import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, saveToken, removeToken } from '../utils/auth';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(localStorage.getItem('userId') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async () => {
  try {
    const response = await api.get('/api/users/profile');
    setUser(response.data.user);
  } catch (error) {
    console.error('Failed to get user details:', error?.response?.data);
    setError(error?.response?.data?.message);
  } finally {
    setLoading(false);
  }
};
const login = async (userData) => {
  try {
    setLoading(true);
    setError(null);

    const response = await api.post("/api/users/login", userData);

    const { token } = response.data;

    saveToken(token);

    // fetch full user profile
    await fetchUserData();
  } catch (error) {
    setError(error?.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};
  const registerUser = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post("/api/users/register", userData);

      const { token } = response.data;

      saveToken(token);

      await fetchUserData();
    } catch (error) {
      setError(error?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, registerUser, logout, loading, error, fetchUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);