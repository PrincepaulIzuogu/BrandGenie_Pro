// src/pages/tools/notion/Notion.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdEdit, MdDelete } from 'react-icons/md';
import notionLogo from '../../../images/notion.png';

interface Doc {
  id: string;
  title: string;
  createdAt: string;
}

const Notion: React.FC = () => {
  const [documents, setDocuments] = useState<Doc[]>([]);
  const [draftExists, setDraftExists] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('notion_documents');
    if (stored) {
      setDocuments(JSON.parse(stored));
    }
    const draft = localStorage.getItem('notion_current_draft');
    setDraftExists(!!draft);
  }, []);

  const handleDelete = (id: string) => {
    const updated = documents.filter((doc) => doc.id !== id);
    setDocuments(updated);
    localStorage.setItem('notion_documents', JSON.stringify(updated));
  };

  const handleDiscardDraft = () => {
    localStorage.removeItem('notion_current_draft');
    setDraftExists(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <img src={notionLogo} alt="Notion" className="w-10 h-10" />
          <h1 className="text-2xl font-bold">Notion Workspace</h1>
        </div>

        <button
          onClick={() => navigate('/tools/notion/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          + New Document
        </button>
      </div>

      {draftExists && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6 rounded shadow flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Draft in Progress</h2>
            <p className="text-sm text-gray-700">You have an unsaved document in progress.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/tools/notion/new')}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
            >
              <MdEdit /> Continue Editing
            </button>
            <button
              onClick={handleDiscardDraft}
              className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
            >
              <MdDelete /> Discard
            </button>
          </div>
        </div>
      )}

      {documents.length === 0 ? (
        <p className="text-gray-500">No saved documents yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-white rounded shadow p-4 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">{doc.title}</h3>
                <p className="text-sm text-gray-500">{new Date(doc.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => navigate('/tools/notion/new')}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                >
                  <MdEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
                >
                  <MdDelete /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notion;
