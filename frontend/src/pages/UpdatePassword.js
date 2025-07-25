import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/Api.js';

const UpdatePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return false;
    }
    if (formData.newPassword.length < 8 || formData.newPassword.length > 16) {
      setError('New password must be between 8 and 16 characters');
      return false;
    }
    if (!/(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/.test(formData.newPassword)) {
      setError('New password must contain at least one uppercase letter and one special character');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await api.put('/auth/update-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      setSuccess('Password updated successfully');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      
      // Redirect based on role after a delay
      setTimeout(() => {
        switch (user.role) {
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'store_owner':
            navigate('/store-owner/dashboard');
            break;
          case 'user':
            navigate('/user/stores');
            break;
          default:
            navigate('/');
        }
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Update Password
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="currentPassword"
              label="Current Password"
              type="password"
              value={formData.currentPassword}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="newPassword"
              label="New Password (8-16 chars, 1 uppercase, 1 special char)"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm New Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default UpdatePassword;