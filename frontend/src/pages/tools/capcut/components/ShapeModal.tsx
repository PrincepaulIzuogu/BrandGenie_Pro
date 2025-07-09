import React from 'react';

export type ShapeType = 'rectangle' | 'circle' | 'triangle' | 'arrow';

interface ShapeModalProps {
  onSelect: (shape: ShapeType) => void;
  onClose: () => void;
}

const ShapeModal: React.FC<ShapeModalProps> = ({ onSelect, onClose }) => {
  const shapes: ShapeType[] = ['rectangle', 'circle', 'triangle', 'arrow'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Choose a Shape</h2>
        <div className="grid grid-cols-2 gap-4">
          {shapes.map((shape) => (
            <button
              key={shape}
              onClick={() => onSelect(shape)}
              className="p-4 bg-gray-100 rounded hover:bg-blue-100 text-gray-700 font-medium text-sm"
            >
              {shape}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-6 text-sm text-red-500 hover:text-red-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ShapeModal;
