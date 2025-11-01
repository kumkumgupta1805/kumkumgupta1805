import React, { useEffect, useRef, useState } from 'react';
import { Box, Card, CardContent, Typography, Stack, Button, List, ListItem, ListItemText } from '@mui/material';
import HeartRateChart from '../components/HeartRateChart';
import { fetchHeartRate } from '../utils/api';

export default function PatientDashboard() {
  const [current, setCurrent] = useState(null);
  const [history, setHistory] = useState([]);
  const prevRef = useRef(null);
  const [alerted, setAlerted] = useState(false);

  async function poll() {
    const data = await fetchHeartRate();
    const bpm = data.heartRate;
    const time = new Date(data.timestamp).toLocaleTimeString();
    setCurrent(bpm);
    setHistory((h) => [...h.slice(-19), { time, bpm }]);
    if (prevRef.current != null) {
      const prev = prevRef.current;
      const diff = Math.abs(bpm - prev);
      if (diff > prev * 0.4 && !alerted) {
        // Alert integration removed
        setAlerted(true);
        setTimeout(() => setAlerted(false), 60000);
      }
    }
    prevRef.current = bpm;
  }

  useEffect(() => {
    poll();
    const id = setInterval(poll, 5000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Patient Dashboard</Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">Current Heart Rate</Typography>
            <Typography variant="h2">{current ?? '--'} bpm</Typography>
            <Box mt={2}><Button variant="outlined" onClick={poll}>Refresh</Button></Box>
          </CardContent>
        </Card>
        <Card sx={{ flex: 2 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">Recent Trend</Typography>
            <HeartRateChart data={history} />
          </CardContent>
        </Card>
      </Stack>
      <Card>
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>Recent Readings</Typography>
          <List dense>
            {[...history].reverse().map((r, idx) => (
              <ListItem key={idx} divider>
                <ListItemText primary={`${r.bpm} bpm`} secondary={r.time} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Stack>
  );
}


