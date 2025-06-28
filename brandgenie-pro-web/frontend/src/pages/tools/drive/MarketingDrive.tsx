// src/pages/tools/drive/MarketingDrive.tsx
import React, { useEffect, useState } from 'react';
import FileBrowser from 'react-keyed-file-browser';
import 'react-keyed-file-browser/dist/react-keyed-file-browser.css';
import { useUser } from '../../../context/UserContext';
import LeftSidebar from './LeftSidebar';
import TopBar from './TopBar';
import {
  getFilesByCompany,
  createFolder,
  renameFile,
  deleteFile,
  DriveFile
} from '../../../api/driveApi';

const navOptions = ['My Drive', 'Shared with me', 'Recent', 'Starred', 'Trash'];

const MarketingDrive: React.FC = () => {
  const { user } = useUser();

  if (!user || !user.company_id) {
    return <div className="p-6 text-gray-700">Loading user context...</div>;
  }

  const COMPANY_ID = user.company_id;
  const USER_ID = typeof user.id === 'string' ? parseInt(user.id) : user.id;

  const [files, setFiles] = useState<DriveFile[]>([]);
  const [activeNav, setActiveNav] = useState('My Drive');

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await getFilesByCompany(COMPANY_ID);
        setFiles(res);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    if (activeNav === 'My Drive') {
      fetchFiles();
    }
  }, [COMPANY_ID, activeNav]);

  const handleAction = async (file: any) => {
    switch (file.action) {
      case 'CREATE_FOLDER':
        await createFolder(COMPANY_ID, 'New Folder', file.key);
        setFiles(await getFilesByCompany(COMPANY_ID));
        break;
      case 'UPLOAD_FILES':
        await handleUploadFromSidebar(file.files, {
          company_id: COMPANY_ID,
          uploaded_by_user_id: user.role === 'company' ? null : USER_ID,
        });
        break;
      case 'RENAME_FILE':
        await renameFile(file.file.id, file.newKey.split('/').pop());
        setFiles(await getFilesByCompany(COMPANY_ID));
        break;
      case 'DELETE_FILE':
        await deleteFile(file.file.id);
        setFiles(await getFilesByCompany(COMPANY_ID));
        break;
      default:
        break;
    }
  };

  const handleUploadFromSidebar = async (
    selectedFiles: File[],
    metadata: { company_id: number; uploaded_by_user_id: number | null }
  ) => {
    const formData = new FormData();
    formData.append('company_id', metadata.company_id.toString());

    if (metadata.uploaded_by_user_id !== null) {
      formData.append('uploaded_by_user_id', metadata.uploaded_by_user_id.toString());
    }

    selectedFiles.forEach((file) => {
      formData.append('files', file, file.webkitRelativePath || file.name);
    });

    try {
      const res = await fetch('http://localhost:5000/api/drive/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        console.error('Upload failed');
        return;
      }

      const refreshed = await getFilesByCompany(COMPANY_ID);
      setFiles(refreshed);
    } catch (err) {
      console.error('Error uploading files:', err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar
          active={activeNav}
          setActive={setActiveNav}
          options={navOptions}
          onUpload={handleUploadFromSidebar}
        />
        <main className="flex-1 overflow-auto p-4 bg-gray-50">
          <div className="bg-white shadow rounded-lg border border-gray-200 p-4 h-full">
            <h1 className="text-xl font-semibold text-gray-800 mb-2">{activeNav}</h1>

            {activeNav === 'My Drive' ? (
              files.length > 0 ? (
                <FileBrowser
                  files={files.map((f) => ({
                    key: f.path + f.filename + (f.is_folder ? '/' : ''),
                    size: f.size,
                    modified: new Date(f.modified || f.created_at),
                    type: f.is_folder ? 'folder' : 'file',
                    metadata: f,
                  }))}
                  onAction={handleAction}
                  hideDownloadAction={false}
                  hideUploadAction={false}
                  locale={{
                    createFolder: 'New Folder',
                    delete: 'Delete',
                    rename: 'Rename',
                    upload: 'Upload Files',
                  }}
                />
              ) : (
                <p className="text-gray-500 text-sm">No available files or folders.</p>
              )
            ) : (
              <div className="text-gray-600 text-sm mt-2">
                {activeNav === 'Shared with me' && <p>No files shared with you yet.</p>}
                {activeNav === 'Recent' && <p>No recent files or folders.</p>}
                {activeNav === 'Starred' && <p>No starred files or folders.</p>}
                {activeNav === 'Trash' && <p>No deleted files or folders.</p>}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MarketingDrive;
