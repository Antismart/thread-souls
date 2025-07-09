import axios from 'axios';

// Upload file to Pinata via Next.js API route
export const uploadFileToPinata = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  // TODO: Implement file upload support in /api/pinata-upload
  throw new Error('File upload to Pinata via API route not implemented yet.');
};

// Upload JSON metadata to Pinata via Next.js API route
export const uploadJSONToPinata = async (jsonData: object) => {
  const response = await axios.post('/api/pinata-upload', jsonData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};