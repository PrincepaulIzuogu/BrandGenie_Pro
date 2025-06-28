import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify'; // Toastify for notifications
import 'react-toastify/dist/ReactToastify.css'; // Toastify styles
import logo from '../images/logo.png';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');
  const [email, setEmail] = useState(localStorage.getItem('resetEmail') || ''); // Store email temporarily
  const [accountType, setAccountType] = useState(localStorage.getItem('resetAccountType') || ''); // Account type from forgot password
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword || !code) {
      toast.error('Please fill all fields.', { position: 'top-center', autoClose: 3000 });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.', { position: 'top-center', autoClose: 3000 });
      return;
    }

    try {
      setLoading(true);

      const endpoint =
        accountType === 'company'
          ? 'http://localhost:5000/api/reset-password/company'
          : 'http://localhost:5000/api/reset-password/user';

      const response = await axios.post(endpoint, { email, code, new_password: newPassword });

      // Immediately redirect to login page after success
      navigate('/login');

      // Show success toast after redirect
      toast.success('✅ Password reset successful!', { position: 'top-center', autoClose: 3000 });
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast.error(error.response?.data?.detail || 'Failed to reset password.', { position: 'top-center', autoClose: 3000 });
      // Re-enable the button only if the reset was unsuccessful
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-500 flex items-center justify-center px-6">
      <div className="bg-white/20 backdrop-blur-lg p-10 rounded-2xl w-full max-w-md shadow-2xl animate-fade-in">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="BrandGenie Pro" className="h-16 animate-bounce" />
        </div>
        <h2 className="text-2xl font-bold text-white text-center mb-6">Reset Password</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-white">
          <input
            type="text"
            placeholder="Enter reset code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="bg-white/30 px-4 py-2 rounded-lg placeholder-white/70 focus:outline-none"
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="bg-white/30 px-4 py-2 rounded-lg placeholder-white/70 focus:outline-none"
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-white/30 px-4 py-2 rounded-lg placeholder-white/70 focus:outline-none"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-yellow-400 text-black font-bold py-3 rounded-xl hover:bg-yellow-300 transition disabled:opacity-50"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>

          <p className="text-sm text-center text-white mt-4">
            Remembered your password?{' '}
            <span
              onClick={() => navigate('/login')}
              className="underline cursor-pointer hover:text-yellow-300"
            >
              Back to Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
