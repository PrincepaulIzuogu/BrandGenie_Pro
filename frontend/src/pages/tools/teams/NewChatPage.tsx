// src/pages/tools/teams/NewChatPage.tsx
import React, { useState, useEffect } from 'react';
import { useUser } from '../../../context/UserContext';
import { fetchTeams, sendTeamMessage, Team } from '../../../api/teams';

const NewChatPage: React.FC = () => {
  const { user } = useUser();
  const [teamList, setTeamList] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const loadTeams = async () => {
      try {
        if (!user?.company_id) {
          console.warn("No company_id found for user", user);
          return;
        }
        console.log("Fetching teams for company_id:", user.company_id);

        const teams = await fetchTeams(user.company_id);
        console.log("Fetched teams:", teams);

        setTeamList(teams);

        if (teams.length > 0) {
          setSelectedTeamId(teams[0].id);
        } else {
          console.warn("✅ No teams found for this company");
        }
      } catch (error) {
        console.error("❌ Failed to fetch teams:", error);
      }
    };

    loadTeams();
  }, [user]);

  const handleSendMessage = async () => {
    if (!selectedTeamId || !user?.id || !message.trim()) return;

    setIsSending(true);
    try {
      await sendTeamMessage(selectedTeamId, Number(user.id), message.trim());
      alert('Message sent successfully!');
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Start New Chat</h1>

      {/* Dropdown for teams */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">
          Select team to chat with:
        </label>
        <select
          value={selectedTeamId ?? ''}
          onChange={(e) =>
            setSelectedTeamId(e.target.value === '' ? null : Number(e.target.value))
          }
          className="border border-gray-300 p-2 rounded w-full"
        >
          {teamList.length === 0 ? (
            <option value="">No registered team</option>
          ) : (
            <>
              <option value="">Select a team</option>
              {teamList.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </>
          )}
        </select>
      </div>

      {/* Chat input box, always shown */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Your Message
        </label>
        <textarea
          className="border border-gray-300 p-2 rounded w-full mb-4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="Type your message here..."
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          onClick={handleSendMessage}
          disabled={!selectedTeamId || !message.trim() || isSending}
        >
          {isSending ? 'Sending...' : 'Send Message'}
        </button>
      </div>
    </div>
  );
};

export default NewChatPage;
