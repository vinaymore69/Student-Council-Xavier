import express from 'express';
import { google } from 'googleapis';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';
import { Readable } from 'stream';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});

// Google Drive configuration
const DRIVE_FOLDER_ID = process.env.DRIVE_FOLDER_ID || '1Ww_wStv97KLiQ8jlMkDhaLJC2-sLpb4y';

// Get Google Auth
function getGoogleAuth() {
  const credentialsString = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  
  if (!credentialsString) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY not found');
  }
  
  const credentials = JSON.parse(credentialsString);
  
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server running' });
});

// Upload endpoint
app.post('/api/upload-to-drive', upload.single('file'), async (req, res) => {
  console.log('\n=== Upload Request ===');
  
  if (!req.file) {
    console.log('❌ No file');
    return res.status(400).json({ error: 'No file uploaded' });
  }

  console.log('File:', req.file.originalname);
  console.log('Size:', (req.file.size / 1024 / 1024).toFixed(2), 'MB');

  try {
    const auth = getGoogleAuth();
    const drive = google.drive({ version: 'v3', auth });

    // Create stream from buffer
    const stream = Readable.from(req.file.buffer);

    console.log('Uploading to Drive...');

    const response = await drive.files.create({
      requestBody: {
        name: req.file.originalname,
        parents: [DRIVE_FOLDER_ID],
      },
      media: {
        mimeType: req.file.mimetype,
        body: stream,
      },
      fields: 'id, name, mimeType, size',
    });

    const fileId = response.data.id;
    console.log('✅ Uploaded! ID:', fileId);

    // Make public
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    console.log('✅ Made public');

    const result = {
      fileId: fileId,
      fileName: response.data.name,
      fileUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
      viewUrl: `https://drive.google.com/file/d/${fileId}/view`,
      mimeType: response.data.mimeType,
      size: parseInt(response.data.size || '0'),
    };

    res.json(result);
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    let message = 'Upload failed';
    if (error.message.includes('permission')) {
      message = 'Permission denied - share folder with service account';
    }
    
    res.status(500).json({ 
      error: message,
      details: error.message 
    });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Server error', details: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║   🚀 Upload Server Running                 ║');
  console.log('╠════════════════════════════════════════════╣');
  console.log(`║   Port: ${PORT}                               ║`);
  console.log(`║   URL: http://localhost:${PORT}             ║`);
  console.log('╚════════════════════════════════════════════╝\n');
  
  try {
    const auth = getGoogleAuth();
    const creds = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    console.log('✓ Service account:', creds.client_email);
    console.log('✓ Ready to upload!\n');
  } catch (error) {
    console.error('❌ Setup error:', error.message, '\n');
  }
});

console.log('Server script loaded - listening for requests...');