import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserStores from './pages/UserStores';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';
import UpdatePassword from './pages/UpdatePassword';
import Unauthorized from './pages/Unauthorized';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const AppRoutes = () => {
  const { user } = useAuth();

  const getDefaultRoute = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'store_owner':
        return '/store-owner/dashboard';
      case 'user':
        return '/user/stores';
      default:
        return '/login';
    }
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
      <Route path="/login" element={user ? <Navigate to={getDefaultRoute()} replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to={getDefaultRoute()} replace /> : <Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      
      {/* User Routes */}
      <Route
        path="/user/stores"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <UserStores />
          </ProtectedRoute>
        }
      />
      
      {/* Store Owner Routes */}
      <Route
        path="/store-owner/dashboard"
        element={
          <ProtectedRoute allowedRoles={['store_owner']}>
            <StoreOwnerDashboard />
          </ProtectedRoute>
        }
      />
      
      {/* Common Routes */}
      <Route
        path="/update-password"
        element={
          <ProtectedRoute>
            <UpdatePassword />
          </ProtectedRoute>
        }
      />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;