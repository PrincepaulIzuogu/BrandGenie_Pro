import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../images/logo.png';
import { useUser } from '../context/UserContext';

const LoginStaff: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [form, setForm] = useState({ email: '', token: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.token) return;

    setLoading(true);
    try {
      const { data: loginData } = await axios.post('http://localhost:5000/api/login/staff', {
        email: form.email,
        token: form.token,
      });

      const { access_token } = loginData;
      localStorage.setItem('token', access_token);

      const { data: userProfile } = await axios.get(
        'http://localhost:5000/api/user/me',
        { headers: { Authorization: `Bearer ${access_token}` } }
      );

      setUser({
        id: userProfile.id,
        name: userProfile.full_name,
        role: userProfile.role,
      });

      toast.success('🎉 Logged in successfully!', {
        position: 'top-center',
        autoClose: 3000,
      });

      navigate('/staff/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(
        error?.response?.data?.detail || 'Login failed. Please check your token.',
        { position: 'top-center', autoClose: 3000 }
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center px-6">
      <div className="bg-white/20 backdrop-blur-lg p-10 rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="BrandGenie Pro" className="h-16 animate-bounce" />
        </div>

        <h2 className="text-2xl font-bold text-white text-center mb-6">Staff Login</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="Work Email"
            value={form.email}
            onChange={handleChange}
            className="bg-white/30 text-white placeholder-white/70 px-4 py-3 rounded-lg focus:outline-none"
            required
          />
          <input
            type="password"
            name="token"
            placeholder="Access Token"
            value={form.token}
            onChange={handleChange}
            className="bg-white/30 text-white placeholder-white/70 px-4 py-3 rounded-lg focus:outline-none"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-yellow-400 text-black font-bold py-3 rounded-xl hover:bg-yellow-300 transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p className="text-sm text-center text-white mt-2">
            Token expired or missing? Contact your team lead.
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginStaff;
