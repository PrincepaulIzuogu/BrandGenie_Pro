// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import './index.css';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Context
import { UserProvider } from './context/UserContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import LoginCompany from './pages/LoginCompany';
import LoginStaff from './pages/LoginStaff';
import SignupCompany from './pages/SignupCompany';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword'; 
import Onboarding from './pages/Onboarding';
import ChooseUserRole from './pages/ChooseUserRole';
import GroupsPage from './pages/GroupsPage';
import GroupChatView from './pages/GroupChatView';
import StaffDashboard from './pages/staff/StaffDashboard';
import MyGroupsPage from './pages/staff/MyGroupsPage'; 
import MyProjectsPage from './pages/staff/MyProjectsPage';
import MyToolsPage from './pages/staff/MyToolsPage';
import MyDocumentsPage from './pages/staff/MyDocumentsPage';


// Dashboard Layout + Pages
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AddUser from './pages/AddUser';
import Projects from './pages/Projects';
import Settings from './pages/Settings';
import ViewUsersPage from './pages/ViewUsersPage';

// Tools
import ToolsIndex from './pages/tools/index';
import Notion from './pages/tools/notion/Notion';
import NotionEditor from './pages/tools/notion/NotionEditor';
import CoPilot from './pages/tools/copilot/CoPilot';
import CanvasWorkspace from './pages/tools/canvas/CanvasWorkspace';
import Teams from './pages/tools/teams/Teams';
import GoogleStyleCalendar from './pages/tools/googlecalender/GoogleStyleCalendar';
import CapcutEditorPage from './pages/tools/capcut/CapcutEditorPage';
import OauthCallback from './pages/tools/canvas/OauthCallback';
import NewChatPage from './pages/tools/teams/NewChatPage';
import KanbanBoard from './pages/tools/kanban/KanbanBoard';
import MarketingDrive from './pages/tools/drive/MarketingDrive';
import BrandGenieStore from './pages/tools/store/BrandGenieStore';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DndProvider backend={HTML5Backend}>
      <UserProvider>
        <BrowserRouter>
          <ToastContainer 
            position="top-center" 
            autoClose={3000} 
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login/company" element={<LoginCompany />} />
            <Route path="/login/user" element={<LoginStaff />} />
            <Route path="/signup" element={<SignupCompany />} />
            <Route path="/verify" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/choose-role" element={<ChooseUserRole />} />
            <Route path="/onboarding" element={<Onboarding />} />

            {/* Protected Routes */}
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/add-user" element={<AddUser />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/view-users" element={<ViewUsersPage />} />
              <Route path="/groups" element={<GroupsPage />} />
              <Route path="/groups/:groupId" element={<GroupChatView />} />
              <Route path="/staff/dashboard" element={<StaffDashboard />} />
              <Route path="/staff/groups" element={<MyGroupsPage />} /> 
              <Route path="/staff/project" element={<MyProjectsPage />} />
              <Route path="/staff/tools" element={<MyToolsPage />} />
              <Route path="/staff/documents" element={<MyDocumentsPage />} />


              {/* Tools */}
              <Route path="/tools" element={<ToolsIndex />} />
              <Route path="/tools/notion" element={<Notion />} />
              <Route path="/tools/notion/new" element={<NotionEditor />} />
              <Route path="/tools/copilot" element={<CoPilot />} />
              <Route path="/tools/canvas" element={<CanvasWorkspace />} />
              <Route path="/tools/teams" element={<Teams />} />
              <Route path="/teams/new-chat" element={<NewChatPage />} />
              <Route path="/tools/capcut" element={<CapcutEditorPage />} />
              <Route path="/tools/trello" element={<KanbanBoard />} />
              <Route path="/tools/drive" element={<MarketingDrive />} />
              <Route path="/tools/store" element={<BrandGenieStore />} />
              <Route path="/tools/canvas/oauth-callback" element={<OauthCallback />} />
              <Route path="/tools/googlecalender/google" element={<GoogleStyleCalendar />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </DndProvider>
  </React.StrictMode>
);
