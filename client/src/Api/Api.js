import axios from 'axios'
const API = axios.create({ baseURL: 'http://localhost:4000' });


export const createStock = (data) => API.post('/create', data);

export const getStocks = () => API.get(`/getStocks`);

export const Update = (id, updatedData) => API.put(`/update/${id}`, updatedData);
