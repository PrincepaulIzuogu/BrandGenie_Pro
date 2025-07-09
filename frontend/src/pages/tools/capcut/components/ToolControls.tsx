import React from 'react';
import { FaCut, FaFont, FaPalette, FaCropAlt, FaSlidersH, FaMusic, FaSave } from 'react-icons/fa';

export interface ToolControlsProps {
  selectedTool: 'cut' | 'text' | 'filter' | 'crop' | 'adjust' | 'audio' | 'save' | null;
  onSelectTool: (tool: ToolControlsProps['selectedTool']) => void;
}

const ToolControls: React.FC<ToolControlsProps> = ({ selectedTool, onSelectTool }) => {
  const tools = [
    { name: 'cut', icon: <FaCut />, label: 'Cut' },
    { name: 'crop', icon: <FaCropAlt />, label: 'Crop' },
    { name: 'text', icon: <FaFont />, label: 'Text' },
    { name: 'filter', icon: <FaPalette />, label: 'Filter' },
    { name: 'adjust', icon: <FaSlidersH />, label: 'Adjust' },
    { name: 'audio', icon: <FaMusic />, label: 'Audio' },
    { name: 'save', icon: <FaSave />, label: 'Save' }
  ] as const;

  return (
    <div className="flex items-center space-x-4 px-6 py-3 bg-gray-800 text-white border-b border-gray-700">
      {tools.map((tool) => (
        <button
          key={tool.name}
          onClick={() => onSelectTool(tool.name)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition ${
            selectedTool === tool.name
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          <span>{tool.icon}</span>
          <span className="text-sm">{tool.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ToolControls;
