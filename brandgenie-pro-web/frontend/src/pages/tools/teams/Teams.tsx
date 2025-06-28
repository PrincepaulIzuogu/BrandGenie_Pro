// Updated Teams.tsx with correct number conversion for user ID

import React, { useState, useEffect } from 'react';
import Sidebar, { SectionType } from './Sidebar';
import SubSidebar from './SubSidebar';
import TeamChatPanel from './TeamChatPanel';
import { useUser } from '../../../context/UserContext';
import {
  fetchNotifications,
  fetchTeamMessages,
  fetchTeams,
  fetchCommunities,
  fetchSenders,
} from '../../../api/teams';

const Teams: React.FC = () => {
  const { user } = useUser();
  const [activeSection, setActiveSection] = useState<SectionType | null>(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [items, setItems] = useState<{ id: string; label: string }[]>([]);

  // Fetch sidebar list items based on selected section
  useEffect(() => {
    const loadItems = async () => {
      if (!user?.company_id) return;
      try {
        let fetchedItems: { id: string; label: string }[] = [];

        if (activeSection === 'notifications') {
          const data = await fetchNotifications(Number(user.company_id));
          fetchedItems = data.map((n) => ({ id: String(n.id), label: n.body.slice(0, 30) + '...' }));
        } else if (activeSection === 'chat') {
          const senders = await fetchSenders(Number(user.id));
          fetchedItems = senders.map((s) => ({ id: String(s.id), label: s.name }));
        } else if (activeSection === 'teams') {
          const data = await fetchTeams(Number(user.company_id));
          fetchedItems = data.map((team) => ({ id: String(team.id), label: team.name }));
        } else if (activeSection === 'community') {
          const data = await fetchCommunities(Number(user.company_id));
          fetchedItems = data.map((c) => ({ id: String(c.id), label: c.author_name }));
        }

        setItems(fetchedItems);
      } catch (err) {
        console.error('Sidebar fetch failed:', err);
      }
    };

    if (activeSection) loadItems();
  }, [activeSection, user]);

  const renderMainPanel = () => {
    if (activeSection === 'teams' && selectedItemId) {
      return <TeamChatPanel teamId={Number(selectedItemId)} onNewChat={() => setSelectedItemId(null)} />;
    } else if (activeSection === 'notifications' && selectedItemId) {
      return <div className="p-6">📢 Full Notification ID: {selectedItemId}</div>;
    } else if (activeSection === 'chat' && selectedItemId) {
      return <div className="p-6">💬 Chat with: {selectedItemId}</div>;
    } else if (activeSection === 'community' && selectedItemId) {
      return <div className="p-6">🌍 Community: {selectedItemId}</div>;
    }
    return <TeamChatPanel teamId={null} onNewChat={() => setSelectedItemId(null)} />;
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-50">
      <div className="flex-1 flex relative">
        {activeSection && (
          <SubSidebar
            section={activeSection}
            visible={true}
            onSelect={(id) => setSelectedItemId(id)}
            onClose={() => setActiveSection(null)}
            items={items.length > 0 ? items : [{ id: '0', label: `No ${activeSection} found` }]}
          />
        )}
        {renderMainPanel()}
      </div>
      <Sidebar
        expanded={sidebarExpanded}
        toggleExpanded={() => setSidebarExpanded(!sidebarExpanded)}
        onSectionSelect={(section) => {
          setActiveSection(section);
          setSelectedItemId(null);
        }}
      />
    </div>
  );
};

export default Teams;
