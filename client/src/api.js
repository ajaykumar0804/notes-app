import axios from 'axios';
import { baseURL } from './api/constants/constant.js';

const API = axios.create({ baseURL: `${baseURL}` }); // Backend server URL

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
