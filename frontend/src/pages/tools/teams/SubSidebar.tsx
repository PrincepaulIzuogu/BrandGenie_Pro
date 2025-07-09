// File: SubSidebar.tsx
import React from 'react';
import { X } from 'lucide-react';

interface SubSidebarProps {
  section: 'chat' | 'teams' | 'community' | 'notifications'; // ✅ Now includes 'notifications'
  visible: boolean;
  onSelect: (id: string) => void;
  onClose: () => void;
  items: { id: string; label: string }[];
}

const SubSidebar: React.FC<SubSidebarProps> = ({ section, visible, onSelect, onClose, items }) => {
  return (
    <div
      className={`h-full w-64 bg-white border-l border-gray-200 p-4 shadow-md transform transition-transform duration-300 ease-in-out
      ${visible ? 'translate-x-0' : 'translate-x-full'} fixed right-16 top-[80px] z-40`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold capitalize">{section}</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
      </div>
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="cursor-pointer text-gray-700 hover:bg-gray-100 p-2 rounded-lg"
            onClick={() => onSelect(item.id)}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubSidebar;
