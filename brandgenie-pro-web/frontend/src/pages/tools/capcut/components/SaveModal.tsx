import React, { useState } from 'react';

interface SaveModalProps {
  onClose: () => void;
  onSave: (projectData: {
    name: string;
    date: string;
  }) => void;
}

const SaveModal: React.FC<SaveModalProps> = ({ onClose, onSave }) => {
  const [projectName, setProjectName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    if (!projectName.trim()) {
      setError('Please enter a project name.');
      return;
    }

    const date = new Date().toISOString();
    onSave({ name: projectName, date });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[400px] p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Save Your Project</h2>

        <input
          type="text"
          placeholder="Project name"
          value={projectName}
          onChange={(e) => {
            setProjectName(e.target.value);
            setError(null);
          }}
          className="w-full px-4 py-2 border rounded mb-3 focus:outline-none focus:ring"
        />

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveModal;
