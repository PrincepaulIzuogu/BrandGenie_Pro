import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../images/logo.png';

const SignupCompany: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    owner_full_name: '',
    email: '',
    company_name: '',
    password: '',
    confirm_password: '',
    role: 'Manager',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm_password) {
      toast.error("Passwords do not match", {
        position: 'top-center',
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        company_name: form.company_name,
        email: form.email,
        password: form.password,
        owner_full_name: form.owner_full_name,
        role: form.role,
      };

      await axios.post('http://localhost:5000/api/register/company', payload);
      await axios.post(`http://localhost:5000/api/send-verification-code?email=${form.email}`);

      localStorage.setItem('verifyEmail', form.email);

      toast.success('🎉 Company registered successfully! Please check your email.', {
        position: 'top-center',
        autoClose: 3000,
      });

      navigate('/verify');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.detail || 'Registration failed.', {
        position: 'top-center',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 to-blue-600 flex items-center justify-center px-4 sm:px-6">
      <div className="bg-white/20 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-3xl animate-fade-in">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="BrandGenie Pro" className="h-14 sm:h-16 animate-bounce" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2">
          Register as a Company / Manager
        </h2>

        <p className="text-white/80 text-sm text-center mb-4">
          🚫 Only company owners or team leads are allowed to register here.<br />
          All new staff, interns, and freelancers will receive an email from their company with login details.
        </p>

        <form className="grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <input
            name="owner_full_name"
            value={form.owner_full_name}
            onChange={handleChange}
            type="text"
            placeholder="Your Full Name"
            className="px-4 py-2.5 rounded-xl border border-white/30 bg-white/30 text-white placeholder-white/80"
            required
          />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            placeholder="Your Email"
            className="px-4 py-2.5 rounded-xl border border-white/30 bg-white/30 text-white placeholder-white/80"
            required
          />
          <input
            name="company_name"
            value={form.company_name}
            onChange={handleChange}
            type="text"
            placeholder="Company Name"
            className="px-4 py-2.5 rounded-xl border border-white/30 bg-white/30 text-white placeholder-white/80"
            required
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="px-4 py-2.5 rounded-xl border border-white/30 bg-white/30 text-white"
          >
            <option value="Manager">Manager</option>
            <option value="Team Lead">Team Lead</option>
          </select>
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            type="password"
            placeholder="Create a Password"
            className="px-4 py-2.5 rounded-xl border border-white/30 bg-white/30 text-white placeholder-white/80"
            required
          />
          <input
            name="confirm_password"
            value={form.confirm_password}
            onChange={handleChange}
            type="password"
            placeholder="Confirm Password"
            className="px-4 py-2.5 rounded-xl border border-white/30 bg-white/30 text-white placeholder-white/80"
            required
          />
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 text-black font-bold py-3 rounded-xl hover:bg-yellow-300 transition disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Register Company'}
            </button>
          </div>
        </form>

        <div className="text-white mt-4 text-sm text-center">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            className="underline cursor-pointer hover:text-yellow-300"
          >
            Login here
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignupCompany;
