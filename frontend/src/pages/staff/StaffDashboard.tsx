// src/pages/staff/StaffDashboard.tsx
import React, { useEffect, useState } from 'react';
import { Folder, Wrench, FileText, Users, Star, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from '../../api/axios';
import { useUser } from '../../context/UserContext';

const StaffDashboard: React.FC = () => {
  const { user } = useUser();
  const [stats, setStats] = useState({
    groups: 0,
    tools: 0,
    documents: 0,
    projects: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchStats = async () => {
      try {
        const [groupsRes, toolsRes, docsRes, projectsRes] = await Promise.all([
          axios.get(`/groups/user/${user.id}`),
          axios.get('/tools/permissions/tools'),
          axios.get(`/drive/permissions/${user.id}`),
          axios.get('/projects'),
        ]);

        const userTools = toolsRes.data.filter((tool: any) => tool.user_id === user.id);
        const userProjects = projectsRes.data.filter((proj: any) =>
          proj.members.some((member: any) => member.id === user.id)
        );

        setStats({
          groups: groupsRes.data.length,
          tools: userTools.length,
          documents: docsRes.data.length,
          projects: userProjects.length,
        });
      } catch (err) {
        console.error('Failed to fetch staff stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.id]);

  const statCards = [
    { icon: <Folder className="w-6 h-6" />, label: 'My Groups', value: stats.groups },
    { icon: <Wrench className="w-6 h-6" />, label: 'My Tools', value: stats.tools },
    { icon: <FileText className="w-6 h-6" />, label: 'My Documents', value: stats.documents },
    { icon: <Users className="w-6 h-6" />, label: 'My Projects', value: stats.projects },
  ];

  return (
    <motion.div
      className="space-y-10 animate-fade-in"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold text-gray-800">Welcome to Your Staff Dashboard</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4 hover:shadow-lg transition"
          >
            <div className="p-3 bg-blue-100 text-blue-700 rounded-full">{stat.icon}</div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-xl font-bold text-gray-800">{loading ? '...' : stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Favorite Tools */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-700">Favorite Tools</h3>
        </div>
        <p className="text-sm text-gray-600">Not yet</p>
      </div>

      {/* Recent Documents */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-700">Recent Documents</h3>
        </div>
        <p className="text-sm text-gray-600">Not yet</p>
      </div>

      {/* Activity Feed */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-700">Activity Feed</h3>
        </div>
        <ul className="text-sm text-gray-600 list-disc pl-6 space-y-2">
          <li>Not yet</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default StaffDashboard;
