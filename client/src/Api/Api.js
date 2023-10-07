import axios from 'axios'
const API = axios.create({ baseURL: 'https://stocks-pjca.onrender.com' });


export const createStock = (data) => API.post('/create', data);

export const getStocks = () => API.get(`/getStocks`);

export const Update = (id, updatedData) => API.put(`/update/${id}`, updatedData);
