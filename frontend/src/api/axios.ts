import axios from 'axios';

const api = axios.create({
  baseURL: 'https://brandgenie-backend-ene6c9htgcauegg3.westeurope-01.azurewebsites.net/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
