import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../images/logo.png';

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const email = localStorage.getItem('verifyEmail');

  useEffect(() => {
    if (!email) {
      toast.error('No email found. Please sign up again.', {
        position: 'top-center',
        autoClose: 3000,
      });
      navigate('/signup-company');
    }
  }, [email, navigate]);

  const handleVerify = async () => {
    if (!code.trim()) {
      setError('Please enter the verification code.');
      return;
    }

    setLoading(true);
    try {
      await axios.get('https://brandgenie-backend-ene6c9htgcauegg3.westeurope-01.azurewebsites.net/api/verify-email', {
        params: { email, code },
      });

      toast.success('✅ Email verified successfully!', {
        position: 'top-center',
        autoClose: 3000,
      });

      localStorage.removeItem('verifyEmail');

      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Verification failed.';
      console.error('Verification error:', error);
      setError(message);
      toast.error(message, {
        position: 'top-center',
        autoClose: 3000,
      });
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    try {
      setResending(true);
      await axios.post(`https://brandgenie-backend-ene6c9htgcauegg3.westeurope-01.azurewebsites.net/api/send-verification-code?email=${email}`);
      toast.success('📧 Verification code resent!', {
        position: 'top-center',
        autoClose: 3000,
      });
    } catch (error: any) {
      console.error('Resend error:', error);
      toast.error(error.response?.data?.detail || 'Failed to resend code.', {
        position: 'top-center',
        autoClose: 3000,
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center px-6">
      <div className="bg-white/20 backdrop-blur-md p-10 rounded-2xl w-full max-w-md shadow-2xl animate-fade-in">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="BrandGenie Pro" className="h-14 animate-bounce" />
        </div>
        <h2 className="text-2xl font-bold text-white text-center mb-6">Verify Your Email</h2>

        <input
          type="text"
          placeholder="Enter verification code"
          className="w-full px-4 py-2 rounded-lg border border-white/30 bg-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-300"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        {error && <p className="text-red-300 text-sm mt-2">{error}</p>}

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full mt-6 bg-yellow-400 text-black font-bold py-2.5 rounded-xl hover:bg-yellow-300 transition disabled:opacity-50"
        >
          {loading ? 'Verifying...' : 'Verify Email'}
        </button>

        <p className="mt-4 text-sm text-white text-center">
          Didn't receive the code?{' '}
          <span
            onClick={handleResend}
            className="underline cursor-pointer hover:text-yellow-200"
          >
            {resending ? 'Resending...' : 'Resend'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
