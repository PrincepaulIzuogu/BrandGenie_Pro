import React, { useState } from 'react';

interface FilterModalProps {
  onClose: () => void;
  onApplyFilter: (filter: string) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ onClose, onApplyFilter }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('none');

  const handleApply = () => {
    onApplyFilter(selectedFilter);
    onClose();
  };

  const filters = [
    { name: 'None', value: 'none' },
    { name: 'Grayscale', value: 'grayscale(100%)' },
    { name: 'Sepia', value: 'sepia(100%)' },
    { name: 'Invert', value: 'invert(100%)' },
    { name: 'Brightness+', value: 'brightness(1.5)' },
    { name: 'Contrast+', value: 'contrast(1.5)' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[400px] p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Apply Filter</h2>

        <div className="space-y-2">
          {filters.map((f) => (
            <label key={f.value} className="flex items-center space-x-2">
              <input
                type="radio"
                name="filter"
                value={f.value}
                checked={selectedFilter === f.value}
                onChange={() => setSelectedFilter(f.value)}
              />
              <span className="text-gray-700">{f.name}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-end space-x-2 mt-6">
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

export default FilterModal;
