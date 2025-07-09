import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../images/logo.png';
import { useUser } from '../context/UserContext';

const LoginCompany: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) return;

    setLoading(true);
    try {
      const { data: loginData } = await axios.post('https://brandgenie-backend-ene6c9htgcauegg3.westeurope-01.azurewebsites.net/api/login/company', {
        email: form.email,
        password: form.password,
      });

      const { access_token } = loginData;
      localStorage.setItem('token', access_token);

      const { data: companyProfile } = await axios.get(
        'https://brandgenie-backend-ene6c9htgcauegg3.westeurope-01.azurewebsites.net/api/company/me',
        { headers: { Authorization: `Bearer ${access_token}` } }
      );

      console.log('📋 Company Profile:', companyProfile);

      setUser({
  id: companyProfile.id,
  name: companyProfile.company_name,
  role: 'company',
  company_id: companyProfile.id, // ✅ Add this
});


      toast.success('🎉 Login successful!', {
        position: 'top-center',
        autoClose: 3000,
      });

      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage =
        error?.response?.data?.detail ||
        error?.message ||
        'Login failed. Please try again.';

      toast.error(errorMessage, {
        position: 'top-center',
        autoClose: 3000,
      });

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center px-6">
      <div className="bg-white/20 backdrop-blur-lg p-10 rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="BrandGenie Pro" className="h-16 animate-bounce" />
        </div>

        <h2 className="text-2xl font-bold text-white text-center mb-6">Login as Company / Manager</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="Company Email"
            value={form.email}
            onChange={handleChange}
            className="bg-white/30 text-white placeholder-white/70 px-4 py-3 rounded-lg focus:outline-none"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
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
            Forgot password?{' '}
            <span
              onClick={() => navigate('/forgot-password')}
              className="underline cursor-pointer hover:text-yellow-300"
            >
              Reset
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginCompany;
