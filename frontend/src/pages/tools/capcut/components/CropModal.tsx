import React, { useState } from 'react';

interface CropModalProps {
  onClose: () => void;
  onCrop: (x: number, y: number, width: number, height: number) => void;
}

const CropModal: React.FC<CropModalProps> = ({ onClose, onCrop }) => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);

  const handleCrop = () => {
    if (width > 0 && height > 0) {
      onCrop(x, y, width, height);
      onClose();
    } else {
      alert('Width and height must be greater than zero.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[400px] p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Crop Media</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">X</label>
            <input
              type="number"
              value={x}
              onChange={(e) => setX(parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Y</label>
            <input
              type="number"
              value={y}
              onChange={(e) => setY(parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Width</label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Height</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleCrop}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Crop
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropModal;
