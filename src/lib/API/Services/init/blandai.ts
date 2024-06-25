import axios from 'axios';

const blandai = axios.create({
  baseURL: 'https://api.blandai.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default blandai;
