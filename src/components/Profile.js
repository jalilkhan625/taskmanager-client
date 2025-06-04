import React, { useEffect, useRef, useState } from 'react';
import {
  Container,
  TextField,
  Typography,
  Box,
  Button,
  Avatar,
  CircularProgress,
  IconButton,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import { AttachFile } from '@mui/icons-material';
import axios from 'axios';

function Profile({ refreshUserData }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    picture: '',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [openType, setOpenType] = useState(null); // 'followers' | 'following' | null

  const fileInputRef = useRef(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    axios.get(`http://localhost:5000/api/profile/${userId}`).then((res) => {
      const { username, email, picture, followers, following } = res.data;
      setFormData((prev) => ({
        ...prev,
        username,
        email,
        picture,
        password: '',
      }));
      setFollowers(Array.isArray(followers) ? followers : []);
      setFollowing(Array.isArray(following) ? following : []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [userId]);

  const fetchFollowList = async (type) => {
    if (!userId) return;
    const url = `http://localhost:5000/api/${type}/${userId}`;
    try {
      const res = await axios.get(url);
      if (type === 'followers') setFollowers(res.data);
      else setFollowing(res.data);
      setOpenType(type);
    } catch (err) {
      console.error(`Error loading ${type}:`, err);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, picture: reader.result }));
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSave = () => {
    const data = new FormData();
    data.append('username', formData.username);
    data.append('email', formData.email);
    if (formData.password) data.append('password', formData.password);
    if (file) data.append('picture', file);
    else data.append('picture', formData.picture);

    axios.put(`http://localhost:5000/api/profile/${userId}`, data).then((res) => {
      alert('Profile updated');
      if (refreshUserData) refreshUserData();
      if (res.data.picture) {
        setFormData((prev) => ({ ...prev, picture: res.data.picture }));
        setFile(null);
      }
    }).catch(err => {
      console.error(err);
      alert('Update failed');
    });
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  if (loading) {
    return <CircularProgress sx={{ mt: 5, mx: 'auto', display: 'block' }} />;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="center" mb={1} position="relative">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <IconButton
              sx={{
                backgroundColor: '#fff',
                borderRadius: '50%',
                padding: 0.5,
                boxShadow: 1,
              }}
              onClick={handleAvatarClick}
            >
              <AttachFile fontSize="small" />
            </IconButton>
          }
        >
          <Avatar
            src={formData.picture}
            sx={{ width: 80, height: 80, cursor: 'pointer' }}
            onClick={handleAvatarClick}
          />
        </Badge>
      </Box>

      <Typography align="center" fontSize={14} sx={{ color: 'gray', mb: 2 }}>
        <span
          onClick={() => fetchFollowList('followers')}
          style={{ cursor: 'pointer', textDecoration: 'underline' }}
        >
          {followers.length} follower{followers.length !== 1 ? 's' : ''}
        </span>
        &nbsp;•&nbsp;
        <span
          onClick={() => fetchFollowList('following')}
          style={{ cursor: 'pointer', textDecoration: 'underline' }}
        >
          {following.length} following
        </span>
      </Typography>

      <Typography variant="h5" gutterBottom align="center">
        Edit Profile
      </Typography>

      <TextField
        label="Username"
        name="username"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        fullWidth
        margin="normal"
        placeholder="Leave empty to keep current password"
      />

      <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleSave}>
        Save Changes
      </Button>

      {/* Followers/Following Modal */}
      <Dialog open={!!openType} onClose={() => setOpenType(null)} fullWidth maxWidth="sm">
        <DialogTitle>
          {openType === 'followers' ? 'Followers' : 'Following'}
        </DialogTitle>
        <DialogContent>
          <List>
            {(openType === 'followers' ? followers : following).map((user) => (
              <ListItem key={user._id}>
                <ListItemAvatar>
                  <Avatar src={user.picture} alt={user.username} />
                </ListItemAvatar>
                <ListItemText primary={user.username} secondary={user.email} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default Profile;
