import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import {
  LayoutDashboard,
  PlusCircle,
  Users,
  Folder,
  Wrench,
  LayoutGrid,
  FileText,
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user, setUser } = useUser();
  console.log('User context in Sidebar:', user);

  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  if (!user) return null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  let sidebarItems: { to: string; label: string; icon: React.ReactNode }[] = [];

  if (user.role === 'company') {
    sidebarItems = [
      { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard /> },
      { to: '/groups', label: 'Groups', icon: <PlusCircle /> },
      { to: '/view-users', label: 'View Users', icon: <Users /> },
      { to: '/add-user', label: 'Add User', icon: <PlusCircle /> },
      { to: '/projects', label: 'Projects', icon: <LayoutGrid /> },
      { to: '/tools', label: 'Tools', icon: <Wrench /> },
      { to: '/settings', label: 'Settings', icon: <Settings /> },
    ];
  } else if (user.role === 'company_user') {
    sidebarItems = [{ to: '/my-groups', label: 'My Groups', icon: <Folder /> }];
  } else if (user.role === 'independent') {
    sidebarItems = [
      { to: '/my-groups', label: 'My Groups', icon: <Folder /> },
      { to: '/my-tools', label: 'My Tools', icon: <Wrench /> },
    ];
  } else if (['staff', 'intern', 'freelancer'].includes(user.role)) {
    sidebarItems = [
      { to: '/staff/dashboard', label: 'My Dashboard', icon: <LayoutDashboard /> },
      { to: '/staff/groups', label: 'My Groups', icon: <Users /> },
      { to: '/staff/project', label: 'My Projects', icon: <Folder /> },
      { to: '/staff/tools', label: 'My Tools', icon: <Wrench /> },
      { to: '/staff/documents', label: 'My Documents', icon: <FileText /> },
      { to: '/settings', label: 'Settings', icon: <Settings /> },
    ];
  }

  return (
    <div
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-gray-900 text-white min-h-screen flex flex-col justify-between transition-all duration-300`}
    >
      <div className="p-4">
        {/* Top Logo / Toggle Button */}
        <div className="flex justify-between items-center mb-10">
          {isOpen && <span className="text-2xl font-bold">BrandGenie</span>}
          <button onClick={toggleSidebar} className="text-white hover:text-yellow-400">
            {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-4">
          {sidebarItems.map(({ to, label, icon }) => (
            <SidebarLink
              key={to}
              to={to}
              label={label}
              icon={icon}
              isOpen={isOpen}
              active={location.pathname === to}
            />
          ))}
        </nav>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 mx-4 mb-6 rounded transition text-sm flex items-center justify-center gap-2"
      >
        <LogOut size={18} />
        {isOpen && 'Logout'}
      </button>
    </div>
  );
};

interface SidebarLinkProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  isOpen: boolean;
  active?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, label, icon, isOpen, active }) => {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 text-white px-3 py-2 rounded hover:bg-gray-700 transition text-[16px] ${
        active ? 'bg-gray-800 font-semibold' : ''
      }`}
    >
      {icon}
      {isOpen && <span>{label}</span>}
    </Link>
  );
};

export default Sidebar;
