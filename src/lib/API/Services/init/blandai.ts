import axios from 'axios';

const blandai = axios.create({
  baseURL: 'https://api.bland.ai',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default blandai;
