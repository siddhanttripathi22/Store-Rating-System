import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Rating,
  Button,
  Box,
  Alert,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Search, Clear, Star } from '@mui/icons-material';
import Layout from '../components/Layout';
import api from '../utils/Api.js';

const UserStores = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [ratingDialog, setRatingDialog] = useState({ open: false, store: null, rating: 0 });

  useEffect(() => {
    fetchStores();
  }, [search]);

  const fetchStores = async () => {
    try {
      const response = await api.get('/user/stores', {
        params: { search }
      });
      setStores(response.data);
    } catch (error) {
      setError('Failed to fetch stores');
    }
  };

  const handleRatingSubmit = async () => {
    try {
      await api.post('/user/ratings', {
        storeId: ratingDialog.store.id,
        rating: ratingDialog.rating
      });
      setSuccess('Rating submitted successfully');
      setRatingDialog({ open: false, store: null, rating: 0 });
      fetchStores();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit rating');
    }
  };

  const openRatingDialog = (store) => {
    setRatingDialog({
      open: true,
      store,
      rating: store.userRating || 0
    });
  };

  return (
    <Layout title="Stores">
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search stores by name or address..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
          endAdornment: search && (
            <InputAdornment position="end">
              <IconButton onClick={() => setSearch('')}>
                <Clear />
              </IconButton>
            </InputAdornment>
          )
        }}
      />

      <Grid container spacing={3}>
        {stores.map((store) => (
          <Grid item xs={12} md={6} lg={4} key={store.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {store.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {store.address}
                </Typography>
                
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Overall Rating:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating
                      value={parseFloat(store.averageRating) || 0}
                      readOnly
                      precision={0.1}
                    />
                    <Typography variant="body2">
                      ({store.ratingCount || 0} reviews)
                    </Typography>
                  </Box>
                </Box>

                {store.userRating && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Your Rating:
                    </Typography>
                    <Rating value={store.userRating} readOnly />
                  </Box>
                )}

                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Star />}
                  onClick={() => openRatingDialog(store)}
                >
                  {store.userRating ? 'Update Rating' : 'Rate Store'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {stores.length === 0 && !error && (
        <Box textAlign="center" sx={{ mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No stores found
          </Typography>
        </Box>
      )}

      {/* Rating Dialog */}
      <Dialog open={ratingDialog.open} onClose={() => setRatingDialog({ open: false, store: null, rating: 0 })}>
        <DialogTitle>
          Rate {ratingDialog.store?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body1" gutterBottom>
              How would you rate this store?
            </Typography>
            <Rating
              value={ratingDialog.rating}
              onChange={(event, newValue) => {
                setRatingDialog({ ...ratingDialog, rating: newValue });
              }}
              size="large"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRatingDialog({ open: false, store: null, rating: 0 })}>
            Cancel
          </Button>
          <Button onClick={handleRatingSubmit} variant="contained" disabled={!ratingDialog.rating}>
            Submit Rating
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default UserStores;