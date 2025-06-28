// src/components/Topbar.tsx
import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, UserCircle2, Trash2, ArrowLeft } from 'lucide-react';
import notionLogo from '../images/notion.png';
import copilotLogo from '../images/copilot.png';
import canvasLogo from '../images/canvas.png';
import teamsLogo from '../images/teams.png';
import capcutLogo from '../images/capcut.png';
import trelloLogo from '../images/trello.png';
import googledriveLogo from '../images/googledrive.png';
import googleLogo from '../images/google.png';

const routeTitles: { [key: string]: { title: string; logo?: string } } = {
  '/dashboard': { title: 'Dashboard' },
  '/create-group': { title: 'Create Group' },
  '/view-groups': { title: 'View Groups' },
  '/view-users': { title: 'View Users' },
  '/projects': { title: 'Projects' },
  '/analytics': { title: 'Analytics' },
  '/settings': { title: 'Settings' },
  '/tools': { title: 'Marketing Tools' },
  '/tools/docuflow': { title: 'Notion', logo: notionLogo },
  '/tools/notion': { title: 'Notion', logo: notionLogo },
  '/tools/copilot': { title: 'CoPilot', logo: copilotLogo },
  '/tools/canvas': { title: 'Canvas', logo: canvasLogo },
  '/tools/teams': { title: 'Teams', logo: teamsLogo },
  '/tools/capcut': { title: 'Capcut', logo: capcutLogo },
  '/tools/trello': { title: 'Trello', logo: trelloLogo },
  '/tools/googlecalender/google': { title: 'Google Calendar', logo: googleLogo },
  '/tools/drive': { title: 'Google Drive', logo: googledriveLogo },
  '/company-user-dashboard': { title: 'Company User Dashboard' },
  '/independent-dashboard': { title: 'Independent Dashboard' },
};

const Topbar: React.FC = () => {
  const { user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [docTitle, setDocTitle] = useState('Untitled Document');
  const [showProfile, setShowProfile] = useState(false);

  const current = routeTitles[location.pathname];

  const isDashboard =
    location.pathname === '/dashboard' ||
    location.pathname === '/company-user-dashboard' ||
    location.pathname === '/independent-dashboard';

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleClearChat = () => {
    if (location.pathname === '/tools/copilot') {
      localStorage.removeItem('copilot_chat_history');
      window.location.reload();
    }
  };

  return (
    <div className="bg-white shadow-md px-6 py-4 flex items-center justify-between relative">
      {/* Left: Back button, Logo & Title */}
      <div className="flex items-center gap-3">
        {!isDashboard && (
          <button onClick={handleGoBack} className="text-gray-600 hover:text-gray-900 transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        {current?.logo && <img src={current.logo} alt="Tool Logo" className="h-10 w-10" />}
        {location.pathname === '/tools/docuflow/new' ? (
          <input
            type="text"
            value={docTitle}
            onChange={(e) => setDocTitle(e.target.value)}
            placeholder="Untitled Document"
            className="text-xl font-semibold border-none focus:outline-none focus:ring-0 bg-transparent"
          />
        ) : (
          <h1 className="text-xl font-semibold text-gray-800">
            {current?.title || 'BrandGenie'}
          </h1>
        )}
      </div>

      {/* Right: Notification, Clear Chat (only for CoPilot), Profile */}
      <div className="flex items-center gap-4 relative">
        {location.pathname === '/tools/copilot' && (
          <button
            onClick={handleClearChat}
            className="hover:text-red-500 transition flex items-center gap-1 text-sm font-medium"
            title="Clear Chat"
          >
            <Trash2 className="w-5 h-5" />
            Clear Chat
          </button>
        )}

        {/* Notification bell (no badge) */}
        <button className="hover:text-yellow-500 transition">
          <Bell className="w-5 h-5 text-gray-700" />
        </button>

        {/* Profile icon with dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="hover:text-yellow-500 transition"
          >
            <UserCircle2 className="w-8 h-8 text-gray-700" />
          </button>
          {showProfile && user && (
            <div className="absolute right-0 mt-2 w-64 bg-white border rounded-md shadow-lg p-4 z-50">
              <p className="font-semibold text-gray-800">{user.name}</p>
              <p className="text-sm text-gray-600">Role: {user.role}</p>
              {user.company_id && (
                <p className="text-sm text-gray-600">Company ID: {user.company_id}</p>
              )}
              
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
