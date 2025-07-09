import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useUser } from '../../../../context/UserContext'; // ✅ Adjust if needed

interface UploadedMedia {
  name: string;
  url: string;
  type: 'video' | 'image' | 'audio';
}

interface UploadPanelProps {
  onUploadComplete: (uploaded: UploadedMedia[]) => void;
}

const UploadPanel: React.FC<UploadPanelProps> = ({ onUploadComplete }) => {
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTypeFromMime = (mime: string): 'video' | 'image' | 'audio' => {
    if (mime.startsWith('video')) return 'video';
    if (mime.startsWith('image')) return 'image';
    if (mime.startsWith('audio')) return 'audio';
    return 'video';
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    if (!user?.company_id) {
      setError("❌ Cannot upload — company_id not found in user context.");
      return;
    }

    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setUploading(true);
    setError(null);

    const uploadedResults: UploadedMedia[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('uploaded_by_company_id', String(user.company_id));

      try {
        const res = await axios.post('https://brandgenie-backend-ene6c9htgcauegg3.westeurope-01.azurewebsites.net/api/media/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const fullUrl = `https://brandgenie-backend-ene6c9htgcauegg3.westeurope-01.azurewebsites.net${res.data.file_url}`; // ✅ Full URL for preview/playback

        const uploadedClip: UploadedMedia = {
          name: file.name,
          url: fullUrl,
          type: getTypeFromMime(file.type),
        };

        uploadedResults.push(uploadedClip);

        // ✅ Save to localStorage
        const previous = JSON.parse(localStorage.getItem('uploadedMedia') || '[]');
        localStorage.setItem('uploadedMedia', JSON.stringify([...previous, uploadedClip]));
      } catch (err) {
        console.error('Upload failed:', file.name, err);
        setError(`❌ Failed to upload ${file.name}`);
      }
    }

    setUploading(false);
    onUploadComplete(uploadedResults);
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  return (
    <div className="text-white px-4 py-6">
      <div
        onClick={triggerFileInput}
        className="w-full h-20 border-2 border-dashed border-gray-500 flex flex-col items-center justify-center rounded-lg cursor-pointer hover:border-blue-500 transition"
      >
        <p className="text-sm text-gray-300">Click or drag to upload media</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*,image/*,audio/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {uploading && <p className="text-gray-400 mt-2">Uploading...</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2 text-sm text-gray-300">
          {selectedFiles.map((file, index) => (
            <div key={index} className="truncate">{file.name}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UploadPanel;
