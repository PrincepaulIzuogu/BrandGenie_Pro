import React from 'react';
import { AlertTriangle } from 'lucide-react'; // disclaimer icon

const CanvasWorkspace: React.FC = () => {
  const handleConnectCanva = () => {
    window.location.href = "http://localhost:5000/oauth/canva/start?company_id=1";
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen">

      {/* Disclaimer at top but behind title and button */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-full px-4 z-0">
        <div className="bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-md px-4 py-3 text-sm font-medium opacity-70 shadow-sm flex items-center justify-center">
          <AlertTriangle className="w-20 h-20 mr-2" />
          The Canva team is currently reviewing our application to lift the restriction on the API key used for the canva connection in this project. We are in close contact with their team and have introduced our app. Due to project time constraints, full Canva app features and templates will be implemented in the future after approval. More details are in the project report.
        </div>
      </div>

      {/* Main content */}
      <div className="z-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Canvas Workspace Integration</h1>
        <button 
          onClick={handleConnectCanva}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Connect Canva
        </button>
      </div>
    </div>
  );
};

export default CanvasWorkspace;
