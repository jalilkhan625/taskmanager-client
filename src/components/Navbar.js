import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  TextField,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Navbar({ onUserUpdate }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState({
    username: '',
    picture: '',
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); // State for search input

  const userId = localStorage.getItem('userId');

  // Fetch user data on mount
  const fetchUserData = () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:5000/api/profile/${userId}`)
      .then((res) => {
        const { username, picture } = res.data;
        console.log('Fetched user data:', res.data);
        setUser({
          username: username || '',
          picture: picture || '',
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch user profile:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser({ username: '', picture: '' }); // Clear user data on logout
    navigate('/');
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search submission
  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`); // Navigate to search route with query
    }
  };

  // Expose the fetchUserData function to child components (e.g., Profile)
  const refreshUserData = () => {
    fetchUserData();
    if (onUserUpdate) onUserUpdate(); // Optional callback for other components
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Task Manager
        </Typography>

        {/* Search Field and Button */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search users..."
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ backgroundColor: 'white', borderRadius: 1, width: 200 }}
            onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()} // Submit on Enter
          />
          <Button
            variant="contained"
            color="secondary"
            sx={{ ml: 1 }}
            onClick={handleSearchSubmit}
          >
            Search
          </Button>
        </Box>

        {!loading && user.username && (
          <Box display="flex" alignItems="center">
            <Typography variant="body1" sx={{ mr: 2 }}>
              Hello, <strong>{user.username}</strong>
            </Typography>

            <IconButton onClick={handleMenuClick} color="inherit">
              <Avatar alt={user.username} src={user.picture} />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleProfile}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;