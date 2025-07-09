// src/pages/Settings.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import defaultPic from '../images/logo.png';

const SettingsPage: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [profile, setProfile] = useState<null | {
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string;
  }>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/profile');
      setProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setProfile(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSaveProfile = async () => {
    try {
      await axios.put('/api/profile', profile);
      fetchProfile();
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Profile Section */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Profile</h2>
        {profile ? (
          <>
            <div className="flex items-center gap-4 mb-4">
              <img
                src={profile.avatarUrl || defaultPic}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border"
              />
              <div className="text-sm text-gray-600 dark:text-gray-300">
                You can change your profile details below.
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="border rounded px-3 py-2"
              />
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                placeholder="Email"
                className="border rounded px-3 py-2 col-span-2"
              />
            </div>
            <button
              onClick={handleSaveProfile}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save Profile
            </button>
          </>
        ) : (
          <p className="text-gray-500 dark:text-gray-300">No profile data available.</p>
        )}
      </div>

      {/* Preferences Section */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Preferences</h2>
        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode((prev) => !prev)}
          />
          Enable Dark Mode
        </label>
      </div>
    </div>
  );
};

export default SettingsPage;
