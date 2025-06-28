// src/pages/Projects.tsx
import React, { useEffect, useState } from 'react';
import api from '../api/axios'; 
import { useUser } from '../context/UserContext';

interface Project {
  id: string;
  name: string;
  end_date: string;
  status: string;
  members: { id: string; full_name?: string; email?: string }[];
}

const ProjectsPage: React.FC = () => {
  const { user } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<{ id: string; full_name?: string; email?: string }[]>([]);
  const [newProject, setNewProject] = useState({
    name: '',
    end_date: '',
    status: 'active',
    member_ids: [] as string[],
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      const data = response.data;
      const projectArray = Array.isArray(data)
        ? data
        : Array.isArray(data.projects)
        ? data.projects
        : [];
      setProjects(projectArray);
    } catch (error) {
      console.error('Failed to load projects:', error);
      setProjects([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      const data = response.data;
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load users:', error);
      setUsers([]);
    }
  };

  const handleCreateProject = async () => {
    try {
      const payload = {
        ...newProject,
        created_by_user_id: user?.role === 'independent' || user?.role === 'company_user' ? user.id : undefined,
        created_by_company_id: user?.role === 'company' ? user.id : undefined,
      };

      await api.post('/projects', payload);
      setNewProject({ name: '', end_date: '', status: 'active', member_ids: [] });
      setShowForm(false);
      fetchProjects();
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const toggleMember = (userId: string) => {
    setNewProject((prev) => ({
      ...prev,
      member_ids: prev.member_ids.includes(userId)
        ? prev.member_ids.filter((id) => id !== userId)
        : [...prev.member_ids, userId],
    }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : '+ Add New Project'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Create Project</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Project Name</label>
            <input
              type="text"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              value={newProject.end_date}
              onChange={(e) => setNewProject({ ...newProject, end_date: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={newProject.status}
              onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Assign Users</label>
            {users.length === 0 ? (
              <p className="text-sm text-gray-500">No users available to assign.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {users.map((user) => (
                  <label key={user.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newProject.member_ids.includes(user.id.toString())}
                      onChange={() => toggleMember(user.id.toString())}
                    />
                    {user.full_name || user.email || 'Unnamed User'}
                  </label>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleCreateProject}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Create Project
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">Project Name</th>
              <th className="px-4 py-2">End Date</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Members</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(projects) && projects.length > 0 ? (
              projects.map((project) => (
                <tr key={project.id} className="border-t">
                  <td className="px-4 py-2 font-medium">{project.name}</td>
                  <td className="px-4 py-2">{project.end_date}</td>
                  <td className="px-4 py-2 capitalize">{project.status}</td>
                  <td className="px-4 py-2 space-y-1">
                    {project.members?.map((member) => (
                      <div key={member.id}>
                        {member.full_name || member.email || 'Unnamed'}
                      </div>
                    ))}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center px-4 py-6 text-gray-500">
                  No projects available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectsPage;
