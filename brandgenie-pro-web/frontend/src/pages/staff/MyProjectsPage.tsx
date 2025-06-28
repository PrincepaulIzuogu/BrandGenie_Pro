import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useUser } from '../../context/UserContext';
import { motion } from 'framer-motion';

interface Project {
  id: number;
  name: string;
  status: string;
  end_date: string;
  members: { id: number; full_name: string }[];
}

const MyProjectsPage: React.FC = () => {
  const { user } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('/projects');
        const userProjects = res.data.filter((project: any) =>
          project.members.some((member: any) => member.id === user?.id)
        );
        setProjects(userProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProjects();
  }, [user]);

  return (
    <motion.div
      className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-lg shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-center">My Projects</h2>

      {loading ? (
        <p className="text-gray-600 text-center">Loading projects...</p>
      ) : projects.length === 0 ? (
        <p className="text-gray-500 text-center">You are not assigned to any projects.</p>
      ) : (
        <div className="space-y-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-gray-50 border p-4 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800">{project.name}</h3>
              <p className="text-sm text-gray-600 mb-2">Status: {project.status}</p>
              <p className="text-sm text-gray-600 mb-2">End Date: {new Date(project.end_date).toLocaleDateString()}</p>
              <div>
                <strong className="text-gray-700">Members:</strong>
                <ul className="list-disc ml-5 text-sm text-gray-700 mt-1">
                  {project.members.map((m) => (
                    <li key={m.id}>{m.full_name}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default MyProjectsPage;
