import api from './axios';

export const getTools = () => api.get('/tools/');
export const addTool = (tool: {
  title: string;
  description: string;
  link: string;
  logo_url: string;
}) => api.post('/tools', tool);
