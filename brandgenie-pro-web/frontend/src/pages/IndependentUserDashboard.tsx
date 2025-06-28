// import React from 'react';

// const IndependentUserDashboard: React.FC = () => {
//   return (
//     <div>
//       <h1 className="text-3xl font-bold mb-6">Independent User Dashboard</h1>
//       <p className="text-gray-700">Manage your personal groups, tools, and work independently here.</p>
//     </div>
//   );
// };

// export default IndependentUserDashboard;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StatCard = ({ title, value }: { title: string; value: number | string }) => (
  <div className="bg-white rounded-lg shadow p-4 text-center">
    <p className="text-gray-500 text-sm mb-1">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const IndependentUserDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    toolsUsed: number;
    activeGroups: number;
    recentActivity: string[];
  } | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/dashboard/independent', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="p-6 text-gray-500">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome, Independent User</h1>
      <p className="text-gray-600 mb-6">Here’s your activity overview.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <StatCard title="Tools Used" value={stats?.toolsUsed ?? '--'} />
        <StatCard title="Active Groups" value={stats?.activeGroups ?? '--'} />
        <StatCard title="Activity Entries" value={stats?.recentActivity?.length ?? '--'} />
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        {stats?.recentActivity?.length ? (
          <ul className="text-sm text-gray-700 space-y-2">
            {stats.recentActivity.map((entry, i) => (
              <li key={i}>• {entry}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No recent activity found.</p>
        )}
      </div>
    </div>
  );
};

export default IndependentUserDashboard;
