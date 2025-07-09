import React, { useRef, useState } from 'react';

interface AudioModalProps {
  onClose: () => void;
  onAudioSelected: (audioUrl: string) => void;
}

const AudioModal: React.FC<AudioModalProps> = ({ onClose, onAudioSelected }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setError(null);
    } else {
      setError('Only audio files are supported (.mp3, .wav, etc.)');
    }
  };

  const handleApply = () => {
    if (previewUrl) {
      onAudioSelected(previewUrl);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[400px] p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Add Background Audio</h2>

        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="mb-3"
        />

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

        {previewUrl && (
          <audio controls src={previewUrl} className="mb-4 w-full" />
        )}

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={!previewUrl}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioModal;
