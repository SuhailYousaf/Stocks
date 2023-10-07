import axios from 'axios';

// Create an Axios instance with a base URL
const API = axios.create({ baseURL: 'https://stocks-pjca.onrender.com' });

// Export functions for making specific API requests

// Create a new stock
export const createStock = (data) => API.post('/create', data);

// Get a list of stocks
export const getStocks = () => API.get('/getStocks');

// Update a stock by its ID
export const Update = (id, updatedData) => API.put(`/update/${id}`, updatedData);
