import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Layout = ({ children, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleDisplay = (role) => {
    switch (role) {
      case 'admin':
        return 'System Administrator';
      case 'store_owner':
        return 'Store Owner';
      case 'user':
        return 'User';
      default:
        return '';
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Store Rating System - {title}
          </Typography>
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2">
                {user.name} ({getRoleDisplay(user.role)})
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;