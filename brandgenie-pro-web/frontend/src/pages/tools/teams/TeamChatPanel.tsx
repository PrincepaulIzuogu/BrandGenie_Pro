// src/pages/tools/teams/TeamChatPanel.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import welcomeChat from '../../../images/chat_welcome.png';
import welcomeMeeting from '../../../images/meeting_welcome.png';

interface Props {
  teamId: number | null;
  onNewChat: () => void;
}

const TeamChatPanel: React.FC<Props> = ({ teamId, onNewChat }) => {
  const { user } = useUser();
  const navigate = useNavigate(); // ✅ added navigate hook

  const handleMeetNow = () => {
    const randomRoom = `brandgenie-${Math.random().toString(36).substring(2, 10)}`;
    const url = `https://meet.jit.si/${randomRoom}`;
    window.open(url, '_blank');
  };

  if (!teamId) {
    return (
      <div className="flex flex-col items-center justify-center w-full text-center px-4">
        <h2 className="text-2xl font-semibold mb-2">
          Welcome, {user?.name || 'User'}
        </h2>
        <p className="text-gray-600 mb-8">Here are some things to get you going.</p>

        <div className="flex flex-col sm:flex-row gap-12 items-center justify-center">
          {/* Chat Button */}
          <div className="flex flex-col items-center">
            <img src={welcomeChat} alt="Chat Icon" className="w-24 h-24 mb-4" />
            <p className="mb-2 text-gray-700 text-sm max-w-[250px]">
              Send instant messages, share files, and more over chat.
            </p>
            <button
              onClick={() => navigate('/teams/new-chat')} // ✅ replaced with direct navigation
              className="px-4 py-2 rounded border text-sm font-medium hover:bg-gray-100"
            >
              New chat
            </button>
          </div>

          {/* Meet Now Button */}
          <div className="flex flex-col items-center">
            <img src={welcomeMeeting} alt="Meeting Icon" className="w-24 h-24 mb-4" />
            <p className="mb-2 text-gray-700 text-sm max-w-[250px]">
              Skip the calendar and create an instant meeting with just a click.
            </p>
            <button
              onClick={handleMeetNow}
              className="px-4 py-2 rounded border text-sm font-medium hover:bg-gray-100"
            >
              Meet now
            </button>
          </div>
        </div>

        <p className="mt-12 text-sm text-gray-500">
          Stay connected across all your devices by downloading the{' '}
          <a
            className="underline text-blue-600"
            href="https://www.microsoft.com/en-us/microsoft-teams/download-app"
            target="_blank"
            rel="noreferrer"
          >
            Teams mobile app
          </a>.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">Chat for Team #{teamId}</h2>
      <div className="bg-white rounded-lg shadow p-4 text-gray-700">
        Team conversation coming soon...
      </div>
    </div>
  );
};

export default TeamChatPanel;
