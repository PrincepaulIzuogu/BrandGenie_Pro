import React from 'react';
import { MdDelete, MdEdit } from 'react-icons/md';

interface DocumentType {
  id: string;
  title: string;
  createdAt: string;
  content: any;
}

interface Props {
  doc: DocumentType;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const DocCard: React.FC<Props> = ({ doc, onDelete, onEdit }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-800 truncate max-w-[70%]">{doc.title}</h2>
        <div className="flex gap-3">
          <button
            onClick={() => onEdit(doc.id)}
            className="text-gray-600 hover:text-blue-600 transition"
            title="Edit"
          >
            <MdEdit size={18} />
          </button>
          <button
            onClick={() => onDelete(doc.id)}
            className="text-red-500 hover:text-red-700 transition"
            title="Delete"
          >
            <MdDelete size={18} />
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-600 truncate mb-2">
        {doc.content?.blocks?.length > 0
          ? doc.content.blocks
              .map((block: any) => block.data?.text || block.data?.caption || '')
              .join(' ')
              .slice(0, 150)
          : 'No content yet...'}
      </p>

      <span className="text-xs text-gray-400 block">
        Created: {new Date(doc.createdAt).toLocaleString()}
      </span>
    </div>
  );
};

export default DocCard;
