import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/drive';

export interface DriveFile {
  id: number;
  filename: string;
  filetype: string;
  size: number;
  is_folder: boolean;
  path: string;
  company_id: number;
  uploaded_by_user_id?: number;
  created_at: string;
  modified?: string;
}

// ✅ Fetch files by company
export const getFilesByCompany = async (companyId: number): Promise<DriveFile[]> => {
  const res = await axios.get(`${BASE_URL}/files/${companyId}`);
  return res.data;
};

// ✅ Upload file(s)
export const uploadFiles = async (
  companyId: number,
  uploaded_by_user_id: number | null,
  path: string,
  files: File[]
): Promise<DriveFile[]> => {
  const formData = new FormData();
  formData.append('company_id', companyId.toString());
  formData.append('path', path);
  if (uploaded_by_user_id) {
    formData.append('uploaded_by_user_id', uploaded_by_user_id.toString());
  }

  files.forEach((file) => {
    formData.append('files', file);
  });

  const res = await axios.post(`${BASE_URL}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return res.data;
};

// ✅ Create new folder
export const createFolder = async (
  companyId: number,
  name: string,
  path: string
): Promise<DriveFile> => {
  const res = await axios.post(`${BASE_URL}/create-folder`, {
    company_id: companyId,
    filename: name,
    path,
    filetype: 'folder',
    is_folder: true,
  });
  return res.data;
};

// ✅ Rename file/folder
export const renameFile = async (fileId: number, newName: string): Promise<DriveFile> => {
  const formData = new FormData();
  formData.append('new_name', newName);
  const res = await axios.put(`${BASE_URL}/rename/${fileId}`, formData);
  return res.data;
};

// ✅ Delete file/folder
export const deleteFile = async (fileId: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/delete/${fileId}`);
};
