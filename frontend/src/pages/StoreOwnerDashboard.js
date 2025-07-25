import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Rating
} from '@mui/material';
import Layout from '../components/Layout';
import api from '../utils/Api.js';

const StoreOwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/store-owner/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      setError('Failed to fetch dashboard data');
    }
  };

  if (!dashboardData) {
    return (
      <Layout title="Store Owner Dashboard">
        <Typography>Loading...</Typography>
      </Layout>
    );
  }

  return (
    <Layout title="Store Owner Dashboard">
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Store Information */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {dashboardData.store.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {dashboardData.store.address}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {dashboardData.store.email}
          </Typography>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Rating
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h4">
                  {dashboardData.averageRating.toFixed(1)}
                </Typography>
                <Rating value={dashboardData.averageRating} readOnly precision={0.1} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Ratings
              </Typography>
              <Typography variant="h4">
                {dashboardData.totalRatings}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Ratings List */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Customer Ratings
          </Typography>
          
          {dashboardData.ratings.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Customer Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dashboardData.ratings.map((rating) => (
                    <TableRow key={rating.id}>
                      <TableCell>{rating.user.name}</TableCell>
                      <TableCell>{rating.user.email}</TableCell>
                      <TableCell>
                        <Rating value={rating.rating} readOnly size="small" />
                      </TableCell>
                      <TableCell>
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" color="text.secondary">
              No ratings submitted yet.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default StoreOwnerDashboard;