import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import moment from 'moment';

interface Assignment {
  name: string;
  access_start?: string;
  access_end?: string;
}

interface UserType {
  id: number;
  full_name: string;
  email: string;
  role: string;
  contract_expiry: string;
  is_active: boolean;
  groups: string[];
  tools: Assignment[];
  projects: Assignment[];
  documents: Assignment[];
}

const ViewUsersPage: React.FC = () => {
  const { user } = useUser();
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await axios.delete(`https://brandgenie-backend-ene6c9htgcauegg3.westeurope-01.azurewebsites.net/api/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Something went wrong while deleting the user.');
    }
  };

  useEffect(() => {
    if (!user?.company_id) return;

    const fetchUsers = async () => {
      try {
        const response = await axios.get(`https://brandgenie-backend-ene6c9htgcauegg3.westeurope-01.azurewebsites.net/api/users/by-company/${user.company_id}`);
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user?.company_id]);

  const isUserExpired = (expiry: string, active: boolean): boolean => {
    const expiryTime = moment(expiry);
    return !active || moment().isAfter(expiryTime);
  };

  return (
    <motion.div
      className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Users in Your Company</h2>

      {loading ? (
        <div className="text-center text-gray-600">Loading users...</div>
      ) : users.length === 0 ? (
        <div className="text-center text-gray-500">No users found.</div>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2 border">Full Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Role</th>
              <th className="px-4 py-2 border">Contract Ends</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const expired = isUserExpired(u.contract_expiry, u.is_active);
              return (
                <React.Fragment key={u.id}>
                  <tr className="hover:bg-gray-50 border-b">
                    <td className="px-4 py-2 border">{u.full_name}</td>
                    <td className="px-4 py-2 border">{u.email}</td>
                    <td className="px-4 py-2 border capitalize">{u.role}</td>
                    <td className="px-4 py-2 border">{moment(u.contract_expiry).format('LLL')}</td>
                    <td className="px-4 py-2 border">
                      {expired ? (
                        <span className="text-red-500 font-medium">Expired</span>
                      ) : (
                        <span className="text-green-600 font-medium">Active</span>
                      )}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                  <tr className="bg-gray-50 border-b">
                    <td colSpan={6} className="px-6 py-3 text-sm text-gray-700">
                      <div><strong>Groups:</strong> {u.groups.join(', ') || 'None'}</div>

                      <div><strong>Projects:</strong> {u.projects.length > 0 ? (
                        <ul className="list-disc ml-6">
                          {u.projects.map((p, idx) => (
                            <li key={idx}>
                              {p.name} ({moment(p.access_start).format('ll')} – {moment(p.access_end).format('ll')})
                            </li>
                          ))}
                        </ul>
                      ) : 'None'}</div>

                      <div><strong>Tools:</strong> {u.tools.length > 0 ? (
                        <ul className="list-disc ml-6">
                          {u.tools.map((t, idx) => (
                            <li key={idx}>
                              {t.name} ({moment(t.access_start).format('ll')} – {moment(t.access_end).format('ll')})
                            </li>
                          ))}
                        </ul>
                      ) : 'None'}</div>

                      <div><strong>Documents:</strong> {u.documents.length > 0 ? (
                        <ul className="list-disc ml-6">
                          {u.documents.map((d, idx) => (
                            <li key={idx}>
                              {d.name} ({moment(d.access_start).format('ll')} – {moment(d.access_end).format('ll')})
                            </li>
                          ))}
                        </ul>
                      ) : 'None'}</div>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      )}
    </motion.div>
  );
};

export default ViewUsersPage;
