import React, { useState } from 'react';

interface CutModalProps {
  videoDuration: number; // in seconds
  onClose: () => void;
  onCut: (startTime: number, endTime: number) => void;
}

const CutModal: React.FC<CutModalProps> = ({ videoDuration, onClose, onCut }) => {
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(videoDuration);

  const handleCut = () => {
    if (startTime >= 0 && endTime > startTime && endTime <= videoDuration) {
      onCut(startTime, endTime);
      onClose();
    } else {
      alert('Please select a valid time range.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[400px] p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Cut Video</h2>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">Start Time (seconds)</label>
          <input
            type="number"
            min={0}
            max={videoDuration}
            value={startTime}
            onChange={(e) => setStartTime(parseFloat(e.target.value))}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">End Time (seconds)</label>
          <input
            type="number"
            min={startTime}
            max={videoDuration}
            value={endTime}
            onChange={(e) => setEndTime(parseFloat(e.target.value))}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleCut}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Cut
          </button>
        </div>
      </div>
    </div>
  );
};

export default CutModal;
