import api from './axios';

export const getAllGroups = () => api.get('/groups');
export const getAllProjects = () => api.get('/projects');
export const getAllTools = () => api.get('/tools');
export const getAllFilesByCompanyId = (companyId: number) => api.get(`/drive/files/${companyId}`);
