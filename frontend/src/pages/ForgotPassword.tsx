import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify'; // Toastify for notifications
import 'react-toastify/dist/ReactToastify.css'; // Toastify styles
import logo from '../images/logo.png';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [accountType, setAccountType] = useState<'user' | 'company' | ''>(''); // Define account type
  const [loading, setLoading] = useState(false); // Loading state to disable button

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !accountType) {
      toast.error('Please fill all fields.', { position: 'top-center', autoClose: 3000 });
      return;
    }

    try {
      setLoading(true); // Disable button while loading

      const endpoint =
        accountType === 'company'
          ? 'https://brandgenie-backend-ene6c9htgcauegg3.westeurope-01.azurewebsites.net/api/forgot-password/company'
          : 'https://brandgenie-backend-ene6c9htgcauegg3.westeurope-01.azurewebsites.net/api/forgot-password/user';

      // Make API call to send reset code
      await axios.post(endpoint, { email });

      // Immediately redirect after success, without waiting for toast
      navigate('/reset-password');

      // Show success toast after redirect
      toast.success('📧 Reset code sent to your email!', { position: 'top-center', autoClose: 3000 });

      // Save email and account type for use in the reset page
      localStorage.setItem('resetEmail', email);
      localStorage.setItem('resetAccountType', accountType);

    } catch (error: any) {
      console.error('Forgot password error:', error);

      // Show error toast if the request fails
      toast.error(error.response?.data?.detail || 'Failed to send reset code.', {
        position: 'top-center',
        autoClose: 3000,
      });
    } finally {
      setLoading(false); // Re-enable button if the request fails
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-500 flex items-center justify-center px-6">
      <div className="bg-white/20 backdrop-blur-lg p-10 rounded-2xl w-full max-w-md shadow-2xl animate-fade-in">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="BrandGenie Pro" className="h-16 animate-bounce" />
        </div>

        <h2 className="text-2xl font-bold text-white text-center mb-6">Forgot Password</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-white">
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/30 px-4 py-2 rounded-lg placeholder-white/70 focus:outline-none"
            required
          />

          <select
            value={accountType}
            onChange={(e) => setAccountType(e.target.value as 'user' | 'company')}
            className="bg-white/30 text-black px-4 py-2 rounded-lg placeholder-gray-500 focus:outline-none"
            required
          >
            <option value="">Select Account Type</option>
            <option value="user">User (Independent/Company User)</option>
            <option value="company">Company</option>
          </select>

          <button
            type="submit"
            disabled={loading} // Disable button while loading
            className="mt-4 bg-yellow-400 text-black font-bold py-3 rounded-xl hover:bg-yellow-300 transition disabled:opacity-50"
          >
            {loading ? 'Sending Code...' : 'Send Reset Code'}
          </button>

          <p className="text-sm text-center text-white mt-4">
            Remembered password?{' '}
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

export default ForgotPassword;
