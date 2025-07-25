import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  Link
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/Api.js';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (formData.name.length < 20 || formData.name.length > 60) {
      setError('Name must be between 20 and 60 characters');
      return false;
    }
    if (formData.address.length > 400) {
      setError('Address must not exceed 400 characters');
      return false;
    }
    if (formData.password.length < 8 || formData.password.length > 16) {
      setError('Password must be between 8 and 16 characters');
      return false;
    }
    if (!/(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(formData.password)) {
      setError('Password must contain at least one uppercase letter and one special character');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/register', formData);
      login(response.data.user, response.data.token);
      navigate('/user/stores');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Store Rating System
          </Typography>
          <Typography component="h2" variant="h5" align="center" gutterBottom>
            Sign Up
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name (20-60 characters)"
              name="name"
              autoFocus
              value={formData.name}
              onChange={handleChange}
              helperText={`${formData.name.length}/60 characters`}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password (8-16 chars, 1 uppercase, 1 special char)"
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="address"
              label="Address (Max 400 characters)"
              name="address"
              multiline
              rows={3}
              value={formData.address}
              onChange={handleChange}
              helperText={`${formData.address.length}/400 characters`}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </Button>
            <Box textAlign="center">
              <Link component={RouterLink} to="/login" variant="body2">
                Already have an account? Sign In
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;