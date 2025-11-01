import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Stack, RadioGroup, FormControlLabel, Radio, Link } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { api, setAuthToken } from '../utils/api';

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Patient');
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/signup', { name, email, password, phone, role });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setAuthToken(token);
      navigate(user.role === 'Doctor' ? '/doctor' : '/patient', { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center" minHeight="70vh">
      <Card sx={{ maxWidth: 640, width: '100%' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Create Account</Typography>
          <Box component="form" onSubmit={onSubmit} mt={2}>
            <Stack spacing={2}>
              <TextField label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required fullWidth />
              <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth />
              <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth />
              <TextField label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required fullWidth />
              <RadioGroup row value={role} onChange={(e) => setRole(e.target.value)}>
                <FormControlLabel value="Doctor" control={<Radio />} label="Doctor" />
                <FormControlLabel value="Patient" control={<Radio />} label="Patient" />
              </RadioGroup>
              {error && <Typography color="error" variant="body2">{error}</Typography>}
              <Button type="submit" variant="contained" size="large">Sign Up</Button>
              <Typography variant="body2">Already have an account? <Link component={RouterLink} to="/login">Login</Link></Typography>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}


