// src/api/groups.ts
import api from './axios';

interface GroupPayload {
  name: string;
  member_ids?: number[];
  created_by_user_id?: number;
  created_by_company_id?: number;
  company_id?: number;
}

export const fetchGroups = () => api.get('/groups');
export const createGroup = (payload: GroupPayload) => api.post('/groups', payload);
