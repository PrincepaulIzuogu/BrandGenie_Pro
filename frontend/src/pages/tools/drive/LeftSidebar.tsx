// src/pages/tools/drive/LeftSidebar.tsx
import React, { ChangeEvent, useRef } from 'react';
import { FaFolder, FaUsers, FaClock, FaStar, FaTrash, FaHdd } from 'react-icons/fa';
import { HiOutlinePlus } from 'react-icons/hi';
import { useUser } from '../../../context/UserContext';

interface LeftSidebarProps {
  active: string;
  setActive: (section: string) => void;
  onUpload: (files: File[], metadata: { company_id: number; uploaded_by_user_id: number | null }) => void;
  options: string[];
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ active, setActive, options, onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { user } = useUser();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0 || !user || !user.company_id) return;

    const filesArray = Array.from(fileList);
    const metadata = {
      company_id: user.company_id,
      uploaded_by_user_id: user.role === 'company' ? null : Number(user.id),
    };

    onUpload(filesArray, metadata);
  };

  const handleNewClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <aside className="w-64 bg-white h-full shadow-sm border-r border-gray-200">
      <div className="p-4 border-b border-gray-100">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
          onClick={handleNewClick}
        >
          <HiOutlinePlus className="text-lg" />
          <span>New</span>
        </button>

        <input
          type="file"
          multiple
          // @ts-ignore
          webkitdirectory=""
          // @ts-ignore
          directory=""
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>

      <nav className="p-2 text-sm text-gray-700 space-y-1">
        {options.map((option) => {
          const icon = {
            'My Drive': <FaFolder />,
            'Shared with me': <FaUsers />,
            'Recent': <FaClock />,
            'Starred': <FaStar />,
            'Trash': <FaTrash />,
          }[option];

          const isActive = active === option;

          return (
            <div
              key={option}
              className={`flex items-center space-x-3 px-4 py-2 rounded-lg cursor-pointer ${
                isActive ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-100'
              }`}
              onClick={() => setActive(option)}
            >
              {icon}
              <span>{option}</span>
            </div>
          );
        })}

        <div className="border-t my-3"></div>

        <div className="px-4 py-2 text-xs text-gray-500">Storage</div>
        <div className="flex items-center px-4 text-xs text-gray-500 space-x-2">
          <FaHdd className="text-gray-400" />
          <span>10.2 GB of 15 GB used</span>
        </div>
        <div className="px-4 pt-2">
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full w-[10%]"></div>
          </div>
          <button className="text-blue-600 hover:underline text-xs mt-2">Get more storage</button>
        </div>
      </nav>
    </aside>
  );
};

export default LeftSidebar;
