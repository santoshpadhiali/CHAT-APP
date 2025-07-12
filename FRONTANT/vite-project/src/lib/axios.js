import axios from 'axios';

export const axiosInstant = axios.create({
  baseURL: 'http://localhost:5001/api/',
  withCredentials: true,
});

