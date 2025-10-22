import express from 'express';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Define upload directories
const UPLOAD_BASE_DIR = path.join(__dirname, 'uploads');
const EMAIL_UPLOADS_DIR = path.join(UPLOAD_BASE_DIR, 'email-attachments');

// Create directories if they don't exist
const createUploadDirs = () => {
  try {
    if (!fs.existsSync(UPLOAD_BASE_DIR)) {
      fs.mkdirSync(UPLOAD_BASE_DIR, { recursive: true });
      console.log('✓ Created base upload directory:', UPLOAD_BASE_DIR);
    }
    
    if (!fs.existsSync(EMAIL_UPLOADS_DIR)) {
      fs.mkdirSync(EMAIL_UPLOADS_DIR, { recursive: true });
      console.log('✓ Created email uploads directory:', EMAIL_UPLOADS_DIR);
    }
  } catch (error) {
    console.error('❌ Error creating directories:', error);
    throw error;
  }
};

// Initialize directories
createUploadDirs();

// Configure multer for disk storage with unique filenames
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, EMAIL_UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: uuid_originalname
    const uniqueId = uuidv4();
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    // Sanitize filename - remove special characters
    const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '_');
    const uniqueFilename = `${uniqueId}_${sanitizedName}${ext}`;
    cb(null, uniqueFilename);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    // Optional: Add file type validation
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|ppt|pptx|zip|rar|txt|mp4|avi|mov/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed types: images, documents, videos, archives'));
    }
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server running',
    uploadDir: EMAIL_UPLOADS_DIR
  });
});

// Upload endpoint
app.post('/api/upload-to-drive', upload.single('file'), async (req, res) => {
  console.log('\n=== Upload Request ===');
  
  if (!req.file) {
    console.log('❌ No file');
    return res.status(400).json({ error: 'No file uploaded' });
  }

  console.log('File:', req.file.originalname);
  console.log('Saved as:', req.file.filename);
  console.log('Size:', (req.file.size / 1024 / 1024).toFixed(2), 'MB');
  console.log('Path:', req.file.path);

  try {
    // Generate file URLs
    const fileId = path.parse(req.file.filename).name; // UUID part
    const relativePath = path.relative(__dirname, req.file.path);
    
    const result = {
      fileId: fileId,
      fileName: req.file.originalname,
      savedFileName: req.file.filename,
      // URL to download/view the file
      fileUrl: `http://localhost:${PORT}/api/files/${req.file.filename}`,
      viewUrl: `http://localhost:${PORT}/api/files/${req.file.filename}`,
      downloadUrl: `http://localhost:${PORT}/api/files/${req.file.filename}?download=true`,
      // Server file path (for database storage)
      filePath: relativePath,
      mimeType: req.file.mimetype,
      size: req.file.size,
    };

    console.log('✅ File uploaded successfully!');
    console.log('Access URL:', result.fileUrl);

    res.json(result);
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    // Clean up file if error occurs
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    
    res.status(500).json({ 
      error: 'Upload failed',
      details: error.message 
    });
  }
});

// Serve uploaded files
app.get('/api/files/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(EMAIL_UPLOADS_DIR, filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Get file stats
    const stats = fs.statSync(filePath);
    
    // Check if download parameter is set
    const isDownload = req.query.download === 'true';
    
    if (isDownload) {
      // Force download with original filename (extract from unique filename)
      const parts = filename.split('_');
      const originalName = parts.slice(1).join('_'); // Remove UUID part
      res.download(filePath, originalName);
    } else {
      // Serve file for viewing
      res.sendFile(filePath);
    }
    
    console.log(`✓ Served file: ${filename} (${isDownload ? 'download' : 'view'})`);
  } catch (error) {
    console.error('Error serving file:', error);
    res.status(500).json({ error: 'Failed to serve file', details: error.message });
  }
});

// List files in email uploads folder
app.get('/api/list-files', async (req, res) => {
  try {
    const files = fs.readdirSync(EMAIL_UPLOADS_DIR);
    
    const fileDetails = files.map(filename => {
      const filePath = path.join(EMAIL_UPLOADS_DIR, filename);
      const stats = fs.statSync(filePath);
      
      return {
        filename: filename,
        path: filePath,
        size: stats.size,
        createdTime: stats.birthtime,
        modifiedTime: stats.mtime,
        url: `http://localhost:${PORT}/api/files/${filename}`
      };
    });
    
    res.json({
      files: fileDetails,
      count: fileDetails.length,
      directory: EMAIL_UPLOADS_DIR
    });
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ error: 'Failed to list files', details: error.message });
  }
});

// Delete file endpoint
app.delete('/api/delete-file/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(EMAIL_UPLOADS_DIR, filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Delete the file
    fs.unlinkSync(filePath);
    
    console.log('✅ Deleted file:', filename);
    res.json({ success: true, message: 'File deleted', filename: filename });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file', details: error.message });
  }
});

// Clean up old files (optional - can be called manually or via cron)
app.post('/api/cleanup-old-files', async (req, res) => {
  try {
    const daysOld = req.body.days || 30; // Default 30 days
    const now = Date.now();
    const cutoffTime = now - (daysOld * 24 * 60 * 60 * 1000);
    
    const files = fs.readdirSync(EMAIL_UPLOADS_DIR);
    let deletedCount = 0;
    
    files.forEach(filename => {
      const filePath = path.join(EMAIL_UPLOADS_DIR, filename);
      const stats = fs.statSync(filePath);
      
      if (stats.mtimeMs < cutoffTime) {
        fs.unlinkSync(filePath);
        deletedCount++;
        console.log(`Deleted old file: ${filename}`);
      }
    });
    
    res.json({ 
      success: true, 
      message: `Cleaned up ${deletedCount} files older than ${daysOld} days`,
      deletedCount: deletedCount
    });
  } catch (error) {
    console.error('Error cleaning up files:', error);
    res.status(500).json({ error: 'Failed to clean up files', details: error.message });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  
  // Handle multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large', details: 'Maximum file size is 100MB' });
    }
    return res.status(400).json({ error: 'Upload error', details: err.message });
  }
  
  res.status(500).json({ error: 'Server error', details: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║   🚀 Email Upload Server Running           ║');
  console.log('╠════════════════════════════════════════════╣');
  console.log(`║   Port: ${PORT}                               ║`);
  console.log(`║   URL: http://localhost:${PORT}             ║`);
  console.log('╠════════════════════════════════════════════╣');
  console.log('║   Upload Directory:                        ║');
  console.log(`║   ${EMAIL_UPLOADS_DIR.padEnd(42)}║`);
  console.log('╚════════════════════════════════════════════╝\n');
  console.log('✓ Ready to accept file uploads!');
  console.log('✓ Files will be saved with unique IDs\n');
});

console.log('Server script loaded - listening for requests...');