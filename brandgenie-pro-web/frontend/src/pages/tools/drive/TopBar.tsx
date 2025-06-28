import React from 'react';
import { FaCog, FaQuestionCircle, FaTh, FaUserCircle } from 'react-icons/fa';
import { IoIosArrowDown } from 'react-icons/io';
import { HiOutlineFilter } from 'react-icons/hi';
import { FiSearch } from 'react-icons/fi';

const TopBar: React.FC = () => {
  return (
    <header className="flex items-center justify-between bg-white px-6 py-3 border-b border-gray-200 shadow-sm">
      {/* Left: Search */}
      <div className="flex items-center w-1/2">
        <div className="relative w-full">
          <span className="absolute left-3 top-2.5 text-gray-500">
            <FiSearch />
          </span>
          <input
            type="text"
            placeholder="Search in Drive"
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Right Icons */}
      <div className="flex items-center space-x-4 text-gray-600 text-lg">
        <FaQuestionCircle className="cursor-pointer hover:text-blue-600" />
        <FaCog className="cursor-pointer hover:text-blue-600" />
        <FaTh className="cursor-pointer hover:text-blue-600" />
        <FaUserCircle className="text-2xl text-orange-500 cursor-pointer" />
      </div>
    </header>
  );
};

export default TopBar;
