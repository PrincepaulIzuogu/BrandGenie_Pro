import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useUser } from '../../context/UserContext';
import { motion } from 'framer-motion';

interface Group {
  id: number;
  name: string;
  members: { id: number; full_name: string }[];
}

interface Message {
  id: number;
  content: string;
  sender_name: string;
  timestamp: string;
}

const MyGroupsPage: React.FC = () => {
  const { user } = useUser();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGroupId, setActiveGroupId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchGroups = async () => {
      if (!user) return;
      try {
        const res = await axios.get(`/groups/user/${user.id}`);
        setGroups(res.data);
      } catch (err) {
        console.error('Error fetching groups:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, [user]);

  const openChat = async (groupId: number) => {
  if (activeGroupId === groupId) {
    setActiveGroupId(null); // hide chat if clicked again
    return;
  }

  setActiveGroupId(groupId);
  try {
    const res = await axios.get(`/groups/messages/${groupId}`);
    setMessages(res.data);
  } catch (err) {
    console.error('Error loading messages:', err);
  }
};


  const sendMessage = async () => {
    if (!newMessage || !user || !activeGroupId) return;
    try {
      const res = await axios.post('/groups/messages', {
        group_id: activeGroupId,
        content: newMessage,
        sender_user_id: user.id,
      });
      setMessages((prev) => [...prev, res.data]);
      setNewMessage('');
    } catch (err) {
      console.error('Sending failed:', err);
    }
  };

  return (
    <motion.div
      className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-lg shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-center">My Groups</h2>

      {loading ? (
        <p className="text-gray-600 text-center">Loading...</p>
      ) : groups.length === 0 ? (
        <p className="text-gray-500 text-center">You are not in any group yet.</p>
      ) : (
        <div className="space-y-6">
          {groups.map((group) => (
            <div key={group.id} className="bg-gray-50 border p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">{group.name}</h3>
                <button
                  className="text-blue-600 hover:underline text-sm"
                  onClick={() => openChat(group.id)}
                >
                  {activeGroupId === group.id ? 'Hide Chat' : 'Open Chat'}
                </button>
              </div>

              <div className="text-sm text-gray-700">
                <strong>Members:</strong>{' '}
                {group.members.map((m) => m.full_name).join(', ') || 'None'}
              </div>

              {activeGroupId === group.id && (
                <div className="mt-4 p-3 border rounded bg-white shadow-inner">
                  <div className="h-40 overflow-y-auto mb-3">
                    {messages.length === 0 ? (
                      <p className="text-gray-400 text-sm">No messages yet.</p>
                    ) : (
                      messages.map((msg) => (
                        <div key={msg.id} className="mb-2">
                          <span className="font-semibold">{msg.sender_name}: </span>
                          <span>{msg.content}</span>
                          <div className="text-xs text-gray-400">
                            {new Date(msg.timestamp).toLocaleString()}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      className="flex-1 border rounded px-2 py-1 text-sm"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                    />
                    <button
                      className="bg-blue-600 text-white px-4 py-1 rounded text-sm"
                      onClick={sendMessage}
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default MyGroupsPage;
