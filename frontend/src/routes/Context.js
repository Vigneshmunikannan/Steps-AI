import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

// Create the context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [accessToken, setAccessToken] = useState(sessionStorage.getItem('access_token'));
  const [userRole, setUserRole] = useState(sessionStorage.getItem('user_role'));

  // Function to set the access token and user role, and store them in session storage
  const login = (token, role) => {
    setAccessToken(token);
    setUserRole(role);
    sessionStorage.setItem('access_token', token);
    sessionStorage.setItem('user_role', role);
  };

  // Function to remove the access token and user role from state and session storage
  const logout = async () => {
    try {
      const accessToken = sessionStorage.getItem('access_token');
      if (!accessToken) {
        sessionStorage.clear();
        navigate("/", { replace: false });
        return;
      }
      await axios.post(`${process.env.REACT_APP_API_URL}/logout`, {}, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      sessionStorage.clear();
      navigate("/login", { replace: false });
    } catch (error) {
      console.error('Error logging out:', error);
      sessionStorage.clear();
      navigate("/login", { replace: false });
    }
  };

  // Function to check if a valid token is available
  const isValidTokenAvailable = () => {
    return accessToken !== null && accessToken !== undefined && accessToken !== '';
  };

  // Functions to check the user's role
  const isAdmin = () => userRole === 'admin';
  const isDoctor = () => userRole === 'doctor';
  const isPatient = () => userRole === 'patient';

  // Update token and role when location changes
  useEffect(() => {
    setAccessToken(sessionStorage.getItem('access_token'));
    setUserRole(sessionStorage.getItem('user_role'));
  }, [location]);

  return (
    <AuthContext.Provider value={{ accessToken, login, logout, isValidTokenAvailable, isAdmin, isDoctor, isPatient }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
   