import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function UserSearch() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [followedUserIds, setFollowedUserIds] = useState([]); // Store followed user IDs

  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('query') || '';
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    setSearchQuery(initialQuery);
    fetchUsers(initialQuery);
    fetchFollowedUsers();
  }, [initialQuery]);

  const fetchUsers = async (query) => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/users?search=${encodeURIComponent(query)}`);
      setUsers(res.data || []);
    } catch (err) {
      console.error('Fetch users error:', err);
      setError('Failed to load users.');
    }
    setLoading(false);
  };

  const fetchFollowedUsers = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/following/${userId}`);
      const ids = res.data.map((item) => item.followingId);
      console.log('Followed users:', ids);
      setFollowedUserIds(ids);
    } catch (err) {
      console.error('Failed to fetch followed users:', err);
    }
  };

  const handleFollowToggle = async (targetId) => {
    if (!userId) return alert('Login required');

    const isFollowing = followedUserIds.includes(targetId);

    try {
      if (isFollowing) {
        await axios.delete('http://localhost:5000/api/follow', {
          data: { followerId: userId, followingId: targetId },
        });
        setFollowedUserIds((prev) => prev.filter((id) => id !== targetId));
      } else {
        await axios.post('http://localhost:5000/api/follow', {
          followerId: userId,
          followingId: targetId,
        });
        setFollowedUserIds((prev) => [...prev, targetId]);
      }
    } catch (err) {
      console.error('Follow/unfollow error:', err);
      alert('Error while updating follow status.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom align="center">
        Search Users by Username
      </Typography>

      {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}

      {error && (
        <Typography color="error" align="center" sx={{ my: 2 }}>
          {error}
        </Typography>
      )}

      {!loading && !error && users.length === 0 && searchQuery && (
        <Typography align="center" sx={{ my: 2 }}>
          No users found for username "{searchQuery}".
        </Typography>
      )}

      {!loading && users.length > 0 && (
        <List>
          {users.map((user) => (
            <ListItem
              key={user._id}
              sx={{ borderBottom: '1px solid #eee', flexDirection: 'column', alignItems: 'flex-start' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <ListItemAvatar>
                  <Avatar src={user.picture} alt={user.username} />
                </ListItemAvatar>
                <ListItemText primary={user.username} secondary={user.email} />
              </Box>
              <Button
                variant="contained"
                size="small"
                sx={{ mt: 1 }}
                onClick={() => handleFollowToggle(user._id)}
              >
                {followedUserIds.includes(user._id) ? 'Following' : 'Follow'}
              </Button>
            </ListItem>
          ))}
        </List>
      )}

      {!loading && !searchQuery && (
        <Typography align="center" sx={{ my: 2 }}>
          Enter a username in the navbar to find users.
        </Typography>
      )}
    </Container>
  );
}

export default UserSearch;
