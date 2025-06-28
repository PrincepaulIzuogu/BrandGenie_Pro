import React, { useState } from 'react';

interface AdjustModalProps {
  onClose: () => void;
  onApplyAdjustments: (adjustments: { brightness: number; contrast: number }) => void;
}

const AdjustModal: React.FC<AdjustModalProps> = ({ onClose, onApplyAdjustments }) => {
  const [brightness, setBrightness] = useState<number>(1); // default 100%
  const [contrast, setContrast] = useState<number>(1); // default 100%

  const handleApply = () => {
    onApplyAdjustments({ brightness, contrast });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[400px] p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Adjust Video</h2>

        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1">Brightness</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={brightness}
            onChange={(e) => setBrightness(parseFloat(e.target.value))}
            className="w-full"
          />
          <p className="text-sm text-gray-500 mt-1">{(brightness * 100).toFixed(0)}%</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1">Contrast</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={contrast}
            onChange={(e) => setContrast(parseFloat(e.target.value))}
            className="w-full"
          />
          <p className="text-sm text-gray-500 mt-1">{(contrast * 100).toFixed(0)}%</p>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdjustModal;
