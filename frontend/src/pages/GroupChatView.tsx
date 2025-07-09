import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import axios from '../api/axios';

interface Message {
  id: number;
  content: string;
  sender_name: string;
  timestamp: string;
}

interface Member {
  id: number;
  full_name?: string;
  email?: string;
}

interface Group {
  id: number;
  name: string;
  members: Member[];
}

const GroupChatView: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { user } = useUser();
  const [group, setGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showMembers, setShowMembers] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (groupId) {
      fetchGroup();
      fetchMessages();
    }
  }, [groupId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchGroup = async () => {
    try {
      const res = await axios.get(`/groups/${groupId}`);
      setGroup(res.data);
    } catch (err) {
      console.error('Failed to fetch group:', err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`/groups/messages/${groupId}`);
      setMessages(res.data || []);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user?.id || !groupId) return;

    try {
      await axios.post('/groups/messages', {
        group_id: Number(groupId),
        content: newMessage.trim(),
        sender_user_id: user.role !== 'company' ? user.id : undefined,
        sender_company_id: user.role === 'company' ? user.id : undefined,
      });
      setNewMessage('');
      fetchMessages();
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div className="p-6 flex flex-col h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {group?.name || 'Group Chat'}
        </h2>
        <div className="relative">
          <button
            onClick={() => setShowMembers(!showMembers)}
            className="text-sm text-blue-600 hover:underline"
          >
            {showMembers ? 'Hide Members' : 'Show Members'}
          </button>
          {showMembers && (
            <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow p-2 z-10 max-h-60 overflow-y-auto">
              {group?.members?.map((m) => (
                <div key={m.id} className="text-sm border-b py-1">
                  {m.full_name || m.email || 'Unnamed'}
                </div>
              ))}
              {group?.members?.length === 0 && <div className="text-gray-500 text-sm">No members</div>}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-100 p-4 rounded shadow">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-3">
            <div className="text-sm font-semibold text-gray-700">{msg.sender_name}</div>
            <div className="text-gray-900">{msg.content}</div>
            <div className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleString()}</div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="mt-4 flex">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border rounded px-3 py-2 mr-2"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default GroupChatView;
