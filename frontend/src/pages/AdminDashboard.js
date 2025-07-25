import React, { useState, useEffect,useCallback } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Add, Search, Clear } from '@mui/icons-material';
import Layout from '../components/Layout';
import api from '../utils/Api.js';


const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [openStoreDialog, setOpenStoreDialog] = useState(false);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'user'
  });
  const [storeForm, setStoreForm] = useState({
    name: '',
    email: '',
    address: '',
    ownerEmail: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [storeSearch, setStoreSearch] = useState('');
  const [userSort, setUserSort] = useState({ field: 'name', direction: 'asc' });
  const [storeSort, setStoreSort] = useState({ field: 'name', direction: 'asc' });




  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data);
    } catch (error) {
      setError('Failed to fetch statistics');
    }
  };

  const fetchUsers = useCallback(async () => {
  try {
    const response = await api.get('/admin/users', {
      params: {
        search: userSearch,
        sortBy: userSort.field,
        sortOrder: userSort.direction.toUpperCase()
      }
    });
    setUsers(response.data);
  } catch (error) {
    setError('Failed to fetch users');
  }
}, [userSearch, userSort]);

const fetchStores = useCallback(async () => {
  try {
    const response = await api.get('/admin/stores', {
      params: {
        search: storeSearch,
        sortBy: storeSort.field,
        sortOrder: storeSort.direction.toUpperCase()
      }
    });
    setStores(response.data);
  } catch (error) {
    setError('Failed to fetch stores');
  }
}, [storeSearch, storeSort]);

  useEffect(() => {
  fetchStats();
  fetchUsers();
  fetchStores();
}, [fetchUsers, fetchStores]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/users', userForm);
      setSuccess('User created successfully');
      setOpenUserDialog(false);
      setUserForm({ name: '', email: '', password: '', address: '', role: 'user' });
      fetchUsers();
      fetchStats();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create user');
    }
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/stores', storeForm);
      setSuccess('Store created successfully');
      setOpenStoreDialog(false);
      setStoreForm({ name: '', email: '', address: '', ownerEmail: '' });
      fetchStores();
      fetchStats();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create store');
    }
  };

  const handleUserSort = (field) => {
    const direction = userSort.field === field && userSort.direction === 'asc' ? 'desc' : 'asc';
    setUserSort({ field, direction });
  };

  const handleStoreSort = (field) => {
    const direction = storeSort.field === field && storeSort.direction === 'asc' ? 'desc' : 'asc';
    setStoreSort({ field, direction });
  };

  useEffect(() => {
    fetchUsers();
  }, [userSearch, userSort]);

  useEffect(() => {
    fetchStores();
  }, [storeSearch, storeSort]);

  return (
    <Layout title="Admin Dashboard">
      <Box sx={{ flexGrow: 1 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        
        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Users
                </Typography>
                <Typography variant="h4">
                  {stats.totalUsers || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Stores
                </Typography>
                <Typography variant="h4">
                  {stats.totalStores || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Ratings
                </Typography>
                <Typography variant="h4">
                  {stats.totalRatings || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Users Section */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Users Management</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenUserDialog(true)}
              >
                Add User
              </Button>
            </Box>
            
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search users..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: userSearch && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setUserSearch('')}>
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={userSort.field === 'name'}
                        direction={userSort.direction}
                        onClick={() => handleUserSort('name')}
                      >
                        Name
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={userSort.field === 'email'}
                        direction={userSort.direction}
                        onClick={() => handleUserSort('email')}
                      >
                        Email
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={userSort.field === 'role'}
                        direction={userSort.direction}
                        onClick={() => handleUserSort('role')}
                      >
                        Role
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.address}</TableCell>
                      <TableCell>{user.role}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Stores Section */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Stores Management</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenStoreDialog(true)}
              >
                Add Store
              </Button>
            </Box>
            
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search stores..."
              value={storeSearch}
              onChange={(e) => setStoreSearch(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: storeSearch && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setStoreSearch('')}>
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={storeSort.field === 'name'}
                        direction={storeSort.direction}
                        onClick={() => handleStoreSort('name')}
                      >
                        Name
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={storeSort.field === 'email'}
                        direction={storeSort.direction}
                        onClick={() => handleStoreSort('email')}
                      >
                        Email
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Rating</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stores.map((store) => (
                    <TableRow key={store.id}>
                      <TableCell>{store.name}</TableCell>
                      <TableCell>{store.email}</TableCell>
                      <TableCell>{store.address}</TableCell>
                      <TableCell>
                        {store.averageRating ? parseFloat(store.averageRating).toFixed(1) : 'No ratings'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Create User Dialog */}
        <Dialog open={openUserDialog} onClose={() => setOpenUserDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Create New User</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleCreateUser} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Name (20-60 characters)"
                value={userForm.name}
                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email"
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                value={userForm.password}
                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Address"
                multiline
                rows={3}
                value={userForm.address}
                onChange={(e) => setUserForm({ ...userForm, address: e.target.value })}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                select
                label="Role"
                value={userForm.role}
                onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
              >
                <MenuItem value="user">Normal User</MenuItem>
                <MenuItem value="store_owner">Store Owner</MenuItem>
                <MenuItem value="admin">System Administrator</MenuItem>
              </TextField>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button onClick={() => setOpenUserDialog(false)}>Cancel</Button>
                <Button type="submit" variant="contained">Create User</Button>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>

        {/* Create Store Dialog */}
        <Dialog open={openStoreDialog} onClose={() => setOpenStoreDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Create New Store</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleCreateStore} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Store Name (20-60 characters)"
                value={storeForm.name}
                onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Store Email"
                type="email"
                value={storeForm.email}
                onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Store Address"
                multiline
                rows={3}
                value={storeForm.address}
                onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Store Owner Email"
                type="email"
                value={storeForm.ownerEmail}
                onChange={(e) => setStoreForm({ ...storeForm, ownerEmail: e.target.value })}
                helperText="Email of an existing store owner user"
              />
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button onClick={() => setOpenStoreDialog(false)}>Cancel</Button>
                <Button type="submit" variant="contained">Create Store</Button>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default AdminDashboard;
