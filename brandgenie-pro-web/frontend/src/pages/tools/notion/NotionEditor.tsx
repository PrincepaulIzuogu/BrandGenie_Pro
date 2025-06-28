// src/pages/tools/notion/NotionEditor.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Table from '@editorjs/table';
import ImageTool from '@editorjs/image';
import Paragraph from '@editorjs/paragraph';
import Marker from '@editorjs/marker';
import Embed from '@editorjs/embed';
import { FaSave, FaShareAlt, FaDownload } from 'react-icons/fa';

const NotionEditor: React.FC = () => {
  const editorRef = useRef<EditorJS | null>(null);
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>('Untitled Document');

  // Initialize EditorJS
  useEffect(() => {
    if (!editorContainerRef.current) return;

    const editor = new EditorJS({
      holder: editorContainerRef.current,
      placeholder: 'Start typing your document...',
      tools: {
        header: Header,
        list: List,
        table: Table,
        image: ImageTool,
        paragraph: Paragraph,
        marker: Marker,
        embed: Embed,
      },
      autofocus: true,
      onChange: async () => {
        const data = await editor.save();
        localStorage.setItem('notion_current_draft', JSON.stringify({ title, content: data }));
      },
    });

    editorRef.current = editor;

    // Load existing draft
    const savedData = localStorage.getItem('notion_current_draft');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setTitle(parsed.title || 'Untitled Document');
      editor.isReady
        .then(() => {
          editor.render(parsed.content);
        })
        .catch((err) => console.error('Failed to load draft', err));
    }

    return () => {
      editorRef.current = null;
    };
  }, []);

  const handleSave = async () => {
    const data = await editorRef.current?.save();
    if (!data) return;

    const stored = localStorage.getItem('notion_documents');
    const parsed = stored ? JSON.parse(stored) : [];

    const newEntry = {
      id: Date.now().toString(),
      title: title || 'Untitled Document',
      content: data,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem('notion_documents', JSON.stringify([newEntry, ...parsed]));
    localStorage.removeItem('notion_current_draft');
    alert('Document saved successfully!');
    navigate('/tools/notion');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Shareable link copied to clipboard!');
  };

  const handleDownload = async () => {
    const data = await editorRef.current?.save();
    if (!data) return;
    const blob = new Blob([JSON.stringify({ title, content: data }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Top Actions */}
      <div className="flex justify-end bg-white shadow px-6 py-3 gap-4 sticky top-0 z-20">
        <button onClick={handleSave} title="Save" className="btn"><FaSave /></button>
        <button onClick={handleShare} title="Share" className="btn"><FaShareAlt /></button>
        <button onClick={handleDownload} title="Download" className="btn"><FaDownload /></button>
      </div>

      {/* Title Input */}
      <div className="flex justify-center py-4 bg-white border-b">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled Document"
          className="text-2xl font-bold text-center w-full max-w-3xl border-none outline-none bg-transparent"
        />
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-auto bg-gray-100 py-8 px-4">
        <div className="bg-white w-[1123px] min-h-[794px] mx-auto rounded shadow-md transition-all">
          <div ref={editorContainerRef} className="p-4"></div>
        </div>
      </div>
    </div>
  );
};

export default NotionEditor;
