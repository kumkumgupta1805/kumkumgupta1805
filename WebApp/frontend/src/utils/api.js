import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';
const AWS_URL = process.env.REACT_APP_AWS_URL || 'https://your-aws-http-api-url/data';

export const api = axios.create({ baseURL: `${API_BASE}/api` });

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

export async function fetchHeartRate() {
  try {
    const res = await axios.get(AWS_URL, { timeout: 4000 });
    return res.data;
  } catch (_) {
    // Fallback mock data
    const now = new Date();
    return {
      patientId: 'P001',
      timestamp: now.toISOString(),
      heartRate: 60 + Math.floor(Math.random() * 80)
    };
  }
}


