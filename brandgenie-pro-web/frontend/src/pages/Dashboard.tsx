// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { Users, Folder, Clock, FileText, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from '../api/axios';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    users: 0,
    projects: 0,
    groups: 0,
    events: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.company_id) return;

    const fetchStats = async () => {
      try {
        const [usersRes, projectsRes, groupsRes, eventsRes] = await Promise.all([
          axios.get(`/users?company_id=${user.company_id}`),
          axios.get(`/projects?company_id=${user.company_id}`),
          axios.get(`/groups?company_id=${user.company_id}`),
          axios.get(`/calendar/events?company_id=${user.company_id}`),
        ]);

        setStats({
          users: usersRes.data.length,
          projects: projectsRes.data.length,
          groups: groupsRes.data.length,
          events: eventsRes.data.length,
        });
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.company_id]);

  const statCards = [
    {
      icon: <Users className="w-6 h-6" />,
      label: 'Users',
      value: stats.users,
      onClick: () => navigate('/view-users'),
    },
    {
      icon: <Folder className="w-6 h-6" />,
      label: 'Projects',
      value: stats.projects,
      onClick: () => navigate('/projects'),
    },
    {
      icon: <Users className="w-6 h-6" />,
      label: 'Groups',
      value: stats.groups,
      onClick: () => navigate('/groups'),
    },
    {
      icon: <Clock className="w-6 h-6" />,
      label: 'Events',
      value: stats.events,
      onClick: () => navigate('/calendar'),
    },
  ];

  return (
    <motion.div
      className="space-y-8 animate-fade-in"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold text-gray-800">Welcome to Your Dashboard</h2>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div
            key={idx}
            onClick={stat.onClick}
            className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4 hover:shadow-lg transition cursor-pointer"
          >
            <div className="p-3 bg-yellow-100 text-yellow-700 rounded-full">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-xl font-bold text-gray-800">
                {loading ? '...' : stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Tools and Documents Access */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div
          className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition cursor-pointer"
          onClick={() => navigate('/staff/tools')}
        >
          <div className="flex items-center gap-3 mb-2">
            <Wrench className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-700">Assigned Tools</h3>
          </div>
          <p className="text-sm text-gray-600">Access the tools you've been assigned.</p>
        </div>

        <div
          className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition cursor-pointer"
          onClick={() => navigate('/staff/documents')}
        >
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-700">My Documents</h3>
          </div>
          <p className="text-sm text-gray-600">View your assigned documents and folders.</p>
        </div>
      </div>

      {/* Activity Placeholder */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h3>
        <ul className="text-sm text-gray-600 list-disc pl-6 space-y-2">
          <li>No recent activities yet</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default Dashboard;
