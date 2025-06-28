import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { fetchGroups, createGroup } from '../api/groups';
import axios from '../api/axios';

interface User {
  id: number;
  full_name?: string;
  email?: string;
}

interface Group {
  id: number;
  name: string;
  members: User[];
}

const GroupsPage: React.FC = () => {
  const { user } = useUser();
  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    member_ids: [] as number[],
  });

  useEffect(() => {
    loadGroups();
    loadUsers();
  }, []);

  const loadGroups = async () => {
    try {
      const response = await fetchGroups();
      setGroups(response.data);
    } catch (error) {
      console.error('Failed to load groups:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await axios.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const toggleMember = (userId: number) => {
    setNewGroup((prev) => ({
      ...prev,
      member_ids: prev.member_ids.includes(userId)
        ? prev.member_ids.filter((id) => id !== userId)
        : [...prev.member_ids, userId],
    }));
  };

  const handleCreateGroup = async () => {
    try {
      const payload = {
        ...newGroup,
        created_by_user_id: user?.role === 'independent' || user?.role === 'company_user' ? Number(user.id) : undefined,
        created_by_company_id: user?.role === 'company' ? Number(user.id) : undefined,
        company_id: user?.company_id ?? (user?.role === 'company' ? Number(user.id) : undefined),
      };
      await createGroup(payload);
      setNewGroup({ name: '', member_ids: [] });
      setShowForm(false);
      loadGroups();
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Groups</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : '+ Create New Group'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded shadow p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">New Group</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Group Name</label>
            <input
              type="text"
              value={newGroup.name}
              onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Select Members</label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {users.map((u) => (
                <label key={u.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newGroup.member_ids.includes(u.id)}
                    onChange={() => toggleMember(u.id)}
                  />
                  {u.full_name || u.email || 'Unnamed'}
                </label>
              ))}
            </div>
          </div>
          <button
            onClick={handleCreateGroup}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Create Group
          </button>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">Group Name</th>
              <th className="px-4 py-2">Members</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <tr
                key={group.id}
                className="border-t hover:bg-gray-50 cursor-pointer"
                onClick={() => window.location.href = `/groups/${group.id}`}
              >
                <td className="px-4 py-2 font-medium">{group.name}</td>
                <td className="px-4 py-2">
                  {group.members.map((m) => (
                    <span key={m.id} className="inline-block mr-2">
                      {m.full_name || m.email || 'Unnamed'}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
            {groups.length === 0 && (
              <tr>
                <td colSpan={2} className="text-center px-4 py-6 text-gray-500">
                  No groups available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GroupsPage;
