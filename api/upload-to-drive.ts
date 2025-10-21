import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';
import formidable from 'formidable';
import fs from 'fs';

// Disable body parser for file upload
export const config = {
  api: {
    bodyParser: false,
  },
};

// Google Drive Configuration
const DRIVE_FOLDER_ID = process.env.DRIVE_FOLDER_ID || '1Ww_wStv97KLiQ8jlMkDhaLJC2-sLpb4y';

// Initialize Google Auth from environment variable
const getGoogleAuth = () => {
  try {
    const credentialsString = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    
    if (!credentialsString) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY environment variable is not set');
    }
    
    const credentials = JSON.parse(credentialsString);
    
    if (!credentials.client_email || !credentials.private_key) {
      throw new Error('Invalid service account credentials format');
    }
    
    return new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });
  } catch (error) {
    console.error('Error parsing Google credentials:', error);
    throw new Error(`Invalid Google Service Account credentials: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify credentials are available
    const auth = getGoogleAuth();
    const drive = google.drive({ version: 'v3', auth });

    const form = formidable({ 
      multiples: false, 
      maxFileSize: 100 * 1024 * 1024 // 100MB
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form:', err);
        return res.status(500).json({ error: 'Error parsing file' });
      }

      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      try {
        const fileMetadata = {
          name: file.originalFilename || 'unnamed-file',
          parents: [DRIVE_FOLDER_ID],
        };

        const media = {
          mimeType: file.mimetype || 'application/octet-stream',
          body: fs.createReadStream(file.filepath),
        };

        console.log('Uploading file to Drive folder:', DRIVE_FOLDER_ID);
        console.log('File name:', fileMetadata.name);
        console.log('Service account:', process.env.GOOGLE_SERVICE_ACCOUNT_KEY ? 'configured' : 'missing');

        const driveFile = await drive.files.create({
          requestBody: fileMetadata,
          media: media,
          fields: 'id, name, mimeType, size, webViewLink, webContentLink',
        });

        console.log('File uploaded successfully, ID:', driveFile.data.id);

        // Make file publicly accessible
        await drive.permissions.create({
          fileId: driveFile.data.id!,
          requestBody: {
            role: 'reader',
            type: 'anyone',
          },
        });

        console.log('File made public');

        // Clean up temp file
        if (fs.existsSync(file.filepath)) {
          fs.unlinkSync(file.filepath);
        }

        const result = {
          fileId: driveFile.data.id!,
          fileName: driveFile.data.name!,
          fileUrl: `https://drive.google.com/uc?export=download&id=${driveFile.data.id}`,
          viewUrl: `https://drive.google.com/file/d/${driveFile.data.id}/view`,
          mimeType: driveFile.data.mimeType || file.mimetype || 'application/octet-stream',
          size: parseInt(driveFile.data.size || '0'),
        };

        console.log('Upload successful:', result);

        return res.status(200).json(result);
      } catch (uploadError: any) {
        console.error('Upload error:', uploadError);
        console.error('Error details:', uploadError.message);
        
        // Clean up temp file in case of error
        if (file.filepath && fs.existsSync(file.filepath)) {
          fs.unlinkSync(file.filepath);
        }
        
        // Provide more specific error messages
        let errorMessage = 'Failed to upload to Drive';
        if (uploadError.message?.includes('permission') || uploadError.message?.includes('access')) {
          errorMessage = 'Permission denied. Make sure the service account has access to the Drive folder.';
        }
        
        return res.status(500).json({ 
          error: errorMessage,
          details: uploadError.message || 'Unknown error'
        });
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}