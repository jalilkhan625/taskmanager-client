// src/components/Login.js
import React, { useState } from 'react';
import {
  Container, TextField, Button, Typography, Box
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(''); // For displaying validation or server errors
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // Clear error on input change
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // Client-side validation
    if (!form.email || !form.password) {
      setError('Email and password are required');
      return;
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.email)) {
      setError('Invalid email format');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/login', form);
      console.log('Login response:', res.data);

      const { userId, username } = res.data;

      if (!userId) {
        setError('Login failed: userId not returned');
        return;
      }

      // Store user data in localStorage
      localStorage.setItem('userId', userId);
      localStorage.setItem('username', username);

      alert(`Welcome ${username}`);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || 'Unknown error';
      setError(`Login failed: ${errorMessage}`);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={10}>
        <Typography variant="h4" mb={2}>Login</Typography>
        {error && (
          <Typography color="error" mb={2}>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            margin="normal"
            error={!!error && error.includes('email')}
            helperText={error && error.includes('email') ? error : ''}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            margin="normal"
            error={!!error && error.includes('password')}
            helperText={error && error.includes('password') ? error : ''}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 2 }}
          >
            Login
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/register')}
            sx={{ mt: 1 }}
          >
            Don't have an account? Register
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default Login;