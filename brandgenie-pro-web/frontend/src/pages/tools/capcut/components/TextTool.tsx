import React, { useState } from 'react';

export interface TextBlock {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  fontSize: number;
}

interface TextToolProps {
  onAddText: (text: TextBlock) => void;
}

const TextTool: React.FC<TextToolProps> = ({ onAddText }) => {
  const [text, setText] = useState('');
  const [color, setColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(24);

  const handleAdd = () => {
    if (!text.trim()) return;
    onAddText({
      id: Date.now().toString(),
      text,
      x: 50,
      y: 50,
      color,
      fontSize
    });
    setText('');
  };

  return (
    <div className="p-4 text-white bg-gray-800 w-full">
      <div className="mb-2">
        <input
          type="text"
          placeholder="Enter text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-2 rounded text-black"
        />
      </div>
      <div className="flex items-center space-x-4 mb-2">
        <label className="text-sm">Font Size</label>
        <input
          type="number"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="w-20 text-black p-1 rounded"
        />
        <label className="text-sm">Color</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </div>
      <button
        onClick={handleAdd}
        className="bg-blue-500 px-4 py-2 rounded text-sm hover:bg-blue-600"
      >
        Add Text
      </button>
    </div>
  );
};

export default TextTool;
