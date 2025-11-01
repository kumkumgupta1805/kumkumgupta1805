import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Stack, Link } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { api, setAuthToken } from '../utils/api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setAuthToken(token);
      navigate(user.role === 'Doctor' ? '/doctor' : '/patient', { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center" minHeight="70vh">
      <Card sx={{ maxWidth: 480, width: '100%' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Welcome Back</Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>Login to continue</Typography>
          <Box component="form" onSubmit={onSubmit} mt={2}>
            <Stack spacing={2}>
              <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth />
              <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth />
              {error && <Typography color="error" variant="body2">{error}</Typography>}
              <Button type="submit" variant="contained" size="large">Login</Button>
              <Typography variant="body2">Don't have an account? <Link component={RouterLink} to="/signup">Sign up</Link></Typography>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}


