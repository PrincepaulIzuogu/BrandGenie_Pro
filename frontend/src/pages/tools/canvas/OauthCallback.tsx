import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CanvasOAuthCallback: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuth = async () => {
      const code = params.get('code');
      const state = params.get('state');
      const companyId = 1; // ✅ Replace this dynamically in future

      if (!code || !state) {
        alert('Missing OAuth params');
        return;
      }

      try {
        await axios.get(`https://brandgenie-backend-ene6c9htgcauegg3.westeurope-01.azurewebsites.net/api/canva/oauth/callback?code=${code}&state=${state}&company_id=${companyId}`);
        alert('✅ Canva connected successfully');
        navigate('/tools/canvas');
      } catch (err) {
        console.error('OAuth failed', err);
        alert('❌ Failed to connect Canva');
      }
    };

    handleOAuth();
  }, [params, navigate]);

  return (
    <div className="p-8 text-center text-lg text-gray-700">
      Connecting to Canva...
    </div>
  );
};

export default CanvasOAuthCallback;
