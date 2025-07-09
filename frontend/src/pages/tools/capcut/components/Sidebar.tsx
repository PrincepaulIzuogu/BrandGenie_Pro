import React from 'react';
import { FaPhotoVideo, FaFont, FaMusic, FaShapes, FaCloudUploadAlt } from 'react-icons/fa';
import capcutLogo from '../assets/capcut.png';

export type TabName = 'Media' | 'Text' | 'Audio' | 'Shapes' | 'Drive';

export interface SidebarProps {
  activeTab: TabName;
  setActiveTab: (tab: TabName) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const tabs: { name: TabName; icon: React.ReactNode }[] = [
    { name: 'Media', icon: <FaPhotoVideo /> },
    { name: 'Text', icon: <FaFont /> },
    { name: 'Audio', icon: <FaMusic /> },
    { name: 'Shapes', icon: <FaShapes /> },
    { name: 'Drive', icon: <FaCloudUploadAlt /> }
  ];

  return (
    <div className="w-20 bg-gray-900 text-white flex flex-col items-center py-4 space-y-6 border-r border-gray-800">
      {/* CapCut Logo */}
      <img
        src={capcutLogo}
        alt="CapCut Logo"
        className="w-8 h-8 mb-4"
        draggable={false}
      />

      {/* Tool Tabs */}
      {tabs.map((tab) => (
        <button
          key={tab.name}
          onClick={() => setActiveTab(tab.name)}
          className={`flex flex-col items-center text-sm px-2 py-2 transition-all ${
            activeTab === tab.name ? 'text-blue-500' : 'text-gray-400'
          } hover:text-blue-400`}
        >
          <div className="text-xl">{tab.icon}</div>
          <span className="text-[10px] mt-1">{tab.name}</span>
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
