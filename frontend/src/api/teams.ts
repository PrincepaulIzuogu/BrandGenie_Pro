// src/api/teams.ts
import axios from 'axios';

const API_BASE_URL = 'https://brandgenie-backend-ene6c9htgcauegg3.westeurope-01.azurewebsites.net'; // Change for production

// ---------------------------
// Interfaces
// ---------------------------

export interface Team {
  id: number;
  name: string;
  created_at: string;
}

export interface Message {
  id: number;
  team_id: number;
  sender_id: number;
  content: string;
  created_at: string;
}

export interface Notification {
  id: number;
  title: string;
  body: string;
  created_at: string;
}

export interface CommunityPost {
  id: number;
  author_name: string;
  summary: string;
  content: string;
  created_at: string;
}

export interface Sender {
  id: number;
  name: string;
}

// ---------------------------
// TEAMS
// ---------------------------

export const fetchTeams = async (company_id: number): Promise<Team[]> => {
  const response = await axios.get(`${API_BASE_URL}/api/teams`, {
    params: { company_id },
  });
  return response.data;
};

export const createTeam = async (company_id: number, name: string): Promise<Team> => {
  const response = await axios.post(`${API_BASE_URL}/api/teams`, {
    company_id,
    name,
  });
  return response.data;
};

// ---------------------------
// MESSAGES
// ---------------------------

export const fetchTeamMessages = async (team_id: number): Promise<Message[]> => {
  const response = await axios.get(`${API_BASE_URL}/api/messages`, {
    params: { team_id },
  });
  return response.data;
};

export const sendTeamMessage = async (
  team_id: number,
  sender_id: number,
  content: string
): Promise<Message> => {
  const response = await axios.post(`${API_BASE_URL}/api/messages`, {
    team_id,
    sender_id,
    content,
  });
  return response.data;
};

// ---------------------------
// NOTIFICATIONS
// ---------------------------

export const fetchNotifications = async (company_id: number): Promise<Notification[]> => {
  const response = await axios.get(`${API_BASE_URL}/api/notifications`, {
    params: { company_id },
  });
  return response.data;
};

export const fetchNotificationDetail = async (notification_id: number): Promise<Notification> => {
  const response = await axios.get(`${API_BASE_URL}/api/notifications/${notification_id}`);
  return response.data;
};

// ---------------------------
// COMMUNITY POSTS
// ---------------------------

export const fetchCommunities = async (company_id: number): Promise<CommunityPost[]> => {
  const response = await axios.get(`${API_BASE_URL}/api/community`, {
    params: { company_id },
  });
  return response.data;
};

export const fetchCommunityPostDetail = async (post_id: number): Promise<CommunityPost> => {
  const response = await axios.get(`${API_BASE_URL}/api/community/${post_id}`);
  return response.data;
};

// ---------------------------
// CHAT SENDERS
// ---------------------------

export const fetchSenders = async (user_id: number): Promise<Sender[]> => {
  const response = await axios.get(`${API_BASE_URL}/api/chat/senders`, {
    params: { user_id },
  });
  return response.data;
};
