import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useUser } from '../../context/UserContext';
import { motion } from 'framer-motion';

interface DriveFile {
  id: number;
  filename: string;
  filetype: string;
  is_folder: boolean;
  path: string;
  size: number;
  created_at: string;
  modified?: string;
}

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = 2;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const MyDocumentsPage: React.FC = () => {
  const { user } = useUser();
  const [documents, setDocuments] = useState<DriveFile[]>([]);
  const [expandedPath, setExpandedPath] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await axios.get(`/drive/user-documents/${user?.id}`);
        const docsOnly = res.data.filter((doc: DriveFile) => !doc.is_folder);
        setDocuments(docsOnly);
      } catch (error) {
        console.error('Error fetching assigned documents:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchDocuments();
  }, [user]);

  // Group documents by path
  const groupedByPath: Record<string, DriveFile[]> = {};
  documents.forEach((doc) => {
    if (!groupedByPath[doc.path]) {
      groupedByPath[doc.path] = [];
    }
    groupedByPath[doc.path].push(doc);
  });

  return (
    <motion.div
      className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-lg shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-center">My Documents</h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading documents...</p>
      ) : Object.keys(groupedByPath).length === 0 ? (
        <p className="text-center text-gray-500">No documents assigned.</p>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByPath).map(([path, files]) => (
            <div key={path} className="border rounded-lg bg-gray-50 shadow-sm">
              <button
                className="w-full text-left px-4 py-3 font-semibold text-gray-800 hover:bg-gray-100 transition"
                onClick={() =>
                  setExpandedPath((prev) => (prev === path ? null : path))
                }
              >
                📁 {path}
              </button>

              {expandedPath === path && (
                <div className="px-4 pb-4">
                  {files.map((doc) => (
                    <div
                      key={doc.id}
                      className="border rounded-md p-3 mt-2 bg-white shadow-sm"
                    >
                      <h4 className="font-semibold text-gray-700">
                        {doc.filename}
                      </h4>
                      <p className="text-sm text-gray-600">{doc.filetype}</p>
                      <p className="text-sm text-gray-500">
                        Size: {formatBytes(doc.size || 0)}
                      </p>
                      <p className="text-xs text-gray-400">
                        Created: {new Date(doc.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default MyDocumentsPage;
