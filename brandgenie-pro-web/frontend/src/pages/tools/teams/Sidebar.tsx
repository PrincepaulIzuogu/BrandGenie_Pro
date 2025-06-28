// Sidebar.tsx
import React from 'react';
import { Users, MessageSquare, Bell, Globe, Video } from 'lucide-react';
import clsx from 'clsx';

export type SectionType = 'chat' | 'teams' | 'community' | 'notifications';

type SidebarProps = {
  expanded: boolean;
  toggleExpanded: () => void;
  onSectionSelect: (section: SectionType) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ expanded, toggleExpanded, onSectionSelect }) => {
  return (
    <div
      className={clsx(
        'h-full bg-gray-100 border-l border-gray-300 flex flex-col py-4 transition-all duration-300',
        expanded ? 'w-52 px-4' : 'w-16 items-center px-2'
      )}
    >
      {/* Expand / Collapse Button */}
      <button
        onClick={toggleExpanded}
        className="mb-6 text-blue-600 hover:text-blue-800 transition self-end"
        title={expanded ? 'Collapse' : 'Expand'}
      >
        {expanded ? '‹' : '›'}
      </button>

      {/* Notifications */}
      <button
        onClick={() => onSectionSelect('notifications')}
        className="flex items-center gap-3 text-blue-700 hover:text-blue-900 mb-4"
      >
        <Bell className="w-5 h-5" />
        {expanded && <span className="text-sm font-medium">Notifications</span>}
      </button>

      {/* Chats */}
      <button
        onClick={() => onSectionSelect('chat')}
        className="flex items-center gap-3 text-blue-700 hover:text-blue-900 mb-4"
      >
        <MessageSquare className="w-5 h-5" />
        {expanded && <span className="text-sm font-medium">Chats</span>}
      </button>

      {/* Teams */}
      <button
        onClick={() => onSectionSelect('teams')}
        className="flex items-center gap-3 text-blue-700 hover:text-blue-900 mb-4"
      >
        <Users className="w-5 h-5" />
        {expanded && <span className="text-sm font-medium">Teams</span>}
      </button>

      {/* Community */}
      <button
        onClick={() => onSectionSelect('community')}
        className="flex items-center gap-3 text-blue-700 hover:text-blue-900 mb-4"
      >
        <Globe className="w-5 h-5" />
        {expanded && <span className="text-sm font-medium">Community</span>}
      </button>

      {/* Start Meeting (reuses chat logic for now) */}
      <button
        className="flex items-center gap-3 text-green-700 hover:text-green-900 mt-auto"
        onClick={() => onSectionSelect('chat')}
      >
        <Video className="w-5 h-5" />
        {expanded && <span className="text-sm font-medium">Start Meeting</span>}
      </button>
    </div>
  );
};

export default Sidebar;
