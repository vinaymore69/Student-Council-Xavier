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
const EVENTS_BASE_DIR = path.join(UPLOAD_BASE_DIR, 'events');
const EVENT_BANNERS_DIR = path.join(EVENTS_BASE_DIR, 'banners');
const EVENT_GALLERY_DIR = path.join(EVENTS_BASE_DIR, 'gallery');
const EVENT_WINNERS_DIR = path.join(EVENTS_BASE_DIR, 'winners');

// Create directories if they don't exist
const createUploadDirs = () => {
  try {
    const dirs = [
      UPLOAD_BASE_DIR,
      EMAIL_UPLOADS_DIR,
      EVENTS_BASE_DIR,
      EVENT_BANNERS_DIR,
      EVENT_GALLERY_DIR,
      EVENT_WINNERS_DIR
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log('✓ Created directory:', dir);
      }
    });
  } catch (error) {
    console.error('❌ Error creating directories:', error);
    throw error;
  }
};

// Initialize directories
createUploadDirs();

// Configure multer for disk storage with unique filenames
const createStorage = (uploadType) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      let destinationDir;
      
      switch (uploadType) {
        case 'event-banner':
          destinationDir = EVENT_BANNERS_DIR;
          break;
        case 'event-gallery':
          destinationDir = EVENT_GALLERY_DIR;
          break;
        case 'event-winner':
          destinationDir = EVENT_WINNERS_DIR;
          break;
        case 'email':
        default:
          destinationDir = EMAIL_UPLOADS_DIR;
          break;
      }
      
      cb(null, destinationDir);
    },
    filename: (req, file, cb) => {
      // Generate unique filename based on upload type
      const uniqueId = uuidv4();
      const ext = path.extname(file.originalname);
      const nameWithoutExt = path.basename(file.originalname, ext);
      const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '_');
      
      let prefix = '';
      
      // Add event ID to filename for better organization
      if (req.body.eventId) {
        prefix = `${req.body.eventId}_`;
      }
      
      const uniqueFilename = `${prefix}${uniqueId}_${sanitizedName}${ext}`;
      cb(null, uniqueFilename);
    }
  });
};

// File filter for validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|ppt|pptx|zip|rar|txt|mp4|avi|mov|webp|svg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type. Allowed: images, documents, videos, archives'));
  }
};

// Create different multer instances for different upload types
const uploadEmail = multer({
  storage: createStorage('email'),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: fileFilter
});

const uploadEventBanner = multer({
  storage: createStorage('event-banner'),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB for banners
  fileFilter: fileFilter
});

const uploadEventGallery = multer({
  storage: createStorage('event-gallery'),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per image
  fileFilter: fileFilter
});

const uploadEventWinner = multer({
  storage: createStorage('event-winner'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB for winner images
  fileFilter: fileFilter
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server running',
    uploadDirs: {
      email: EMAIL_UPLOADS_DIR,
      eventBanners: EVENT_BANNERS_DIR,
      eventGallery: EVENT_GALLERY_DIR,
      eventWinners: EVENT_WINNERS_DIR
    }
  });
});

// ============================================
// EMAIL UPLOAD ENDPOINTS (Existing)
// ============================================

app.post('/api/upload-to-drive', uploadEmail.single('file'), async (req, res) => {
  console.log('\n=== Email Upload Request ===');
  
  if (!req.file) {
    console.log('❌ No file');
    return res.status(400).json({ error: 'No file uploaded' });
  }

  console.log('File:', req.file.originalname);
  console.log('Saved as:', req.file.filename);
  console.log('Size:', (req.file.size / 1024 / 1024).toFixed(2), 'MB');

  try {
    const fileId = path.parse(req.file.filename).name;
    const relativePath = path.relative(__dirname, req.file.path);
    
    const result = {
      fileId: fileId,
      fileName: req.file.originalname,
      savedFileName: req.file.filename,
      fileUrl: `http://localhost:${PORT}/api/files/email/${req.file.filename}`,
      viewUrl: `http://localhost:${PORT}/api/files/email/${req.file.filename}`,
      downloadUrl: `http://localhost:${PORT}/api/files/email/${req.file.filename}?download=true`,
      filePath: relativePath,
      mimeType: req.file.mimetype,
      size: req.file.size,
    };

    console.log('✅ Email file uploaded successfully!');
    res.json(result);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Upload failed', details: error.message });
  }
});

// ============================================
// EVENT BANNER UPLOAD
// ============================================

app.post('/api/upload-event-banner', uploadEventBanner.single('banner'), async (req, res) => {
  console.log('\n=== Event Banner Upload Request ===');
  
  if (!req.file) {
    return res.status(400).json({ error: 'No banner uploaded' });
  }

  const { eventId, eventName } = req.body;
  
  console.log('Event ID:', eventId);
  console.log('Event Name:', eventName);
  console.log('Banner:', req.file.originalname);
  console.log('Size:', (req.file.size / 1024).toFixed(2), 'KB');

  try {
    const result = {
      fileName: req.file.originalname,
      savedFileName: req.file.filename,
      fileUrl: `http://localhost:${PORT}/api/files/event-banner/${req.file.filename}`,
      filePath: path.relative(__dirname, req.file.path),
      mimeType: req.file.mimetype,
      size: req.file.size,
      eventId: eventId
    };

    console.log('✅ Banner uploaded successfully!');
    res.json(result);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Upload failed', details: error.message });
  }
});

// ============================================
// EVENT GALLERY UPLOAD (Multiple images)
// ============================================

app.post('/api/upload-event-gallery', uploadEventGallery.array('images', 50), async (req, res) => {
  console.log('\n=== Event Gallery Upload Request ===');
  
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No images uploaded' });
  }

  const { eventId, subEventId, subEventName } = req.body;
  
  console.log('Event ID:', eventId);
  console.log('Sub Event ID:', subEventId || 'N/A');
  console.log('Sub Event Name:', subEventName || 'N/A');
  console.log('Images count:', req.files.length);

  try {
    const uploadedFiles = req.files.map((file) => ({
      fileName: file.originalname,
      savedFileName: file.filename,
      fileUrl: `http://localhost:${PORT}/api/files/event-gallery/${file.filename}`,
      filePath: path.relative(__dirname, file.path),
      mimeType: file.mimetype,
      size: file.size,
      eventId: eventId,
      subEventId: subEventId || null,
      subEventName: subEventName || null
    }));

    console.log('✅ Gallery images uploaded successfully!');
    res.json({ 
      success: true,
      count: uploadedFiles.length,
      files: uploadedFiles 
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    // Clean up uploaded files on error
    req.files.forEach((file) => {
      if (file.path) {
        fs.unlinkSync(file.path);
      }
    });
    res.status(500).json({ error: 'Upload failed', details: error.message });
  }
});

// ============================================
// EVENT WINNER IMAGE UPLOAD
// ============================================

app.post('/api/upload-winner-image', uploadEventWinner.single('winnerImage'), async (req, res) => {
  console.log('\n=== Winner Image Upload Request ===');
  
  if (!req.file) {
    return res.status(400).json({ error: 'No winner image uploaded' });
  }

  const { eventId, subEventId, subEventName, winnerEmail } = req.body;
  
  console.log('Event ID:', eventId);
  console.log('Sub Event:', subEventName);
  console.log('Winner Email:', winnerEmail);
  console.log('Image:', req.file.originalname);

  try {
    const result = {
      fileName: req.file.originalname,
      savedFileName: req.file.filename,
      fileUrl: `http://localhost:${PORT}/api/files/event-winner/${req.file.filename}`,
      filePath: path.relative(__dirname, req.file.path),
      mimeType: req.file.mimetype,
      size: req.file.size,
      eventId: eventId,
      subEventId: subEventId || null,
      subEventName: subEventName,
      winnerEmail: winnerEmail
    };

    console.log('✅ Winner image uploaded successfully!');
    res.json(result);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Upload failed', details: error.message });
  }
});

// ============================================
// SERVE FILES
// ============================================

// Serve email files
app.get('/api/files/email/:filename', (req, res) => {
  serveFile(req, res, EMAIL_UPLOADS_DIR);
});

// Serve event banner files
app.get('/api/files/event-banner/:filename', (req, res) => {
  serveFile(req, res, EVENT_BANNERS_DIR);
});

// Serve event gallery files
app.get('/api/files/event-gallery/:filename', (req, res) => {
  serveFile(req, res, EVENT_GALLERY_DIR);
});

// Serve event winner files
app.get('/api/files/event-winner/:filename', (req, res) => {
  serveFile(req, res, EVENT_WINNERS_DIR);
});

// Helper function to serve files
function serveFile(req, res, directory) {
  try {
    const filename = req.params.filename;
    const filePath = path.join(directory, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    const isDownload = req.query.download === 'true';
    
    if (isDownload) {
      const parts = filename.split('_');
      const originalName = parts.slice(parts.length - 1).join('_');
      res.download(filePath, originalName);
    } else {
      res.sendFile(filePath);
    }
    
    console.log(`✓ Served file: ${filename} (${isDownload ? 'download' : 'view'})`);
  } catch (error) {
    console.error('Error serving file:', error);
    res.status(500).json({ error: 'Failed to serve file', details: error.message });
  }
}

// ============================================
// DELETE FILE ENDPOINTS
// ============================================

app.delete('/api/delete-file/email/:filename', async (req, res) => {
  deleteFile(req, res, EMAIL_UPLOADS_DIR);
});

app.delete('/api/delete-file/event-banner/:filename', async (req, res) => {
  deleteFile(req, res, EVENT_BANNERS_DIR);
});

app.delete('/api/delete-file/event-gallery/:filename', async (req, res) => {
  deleteFile(req, res, EVENT_GALLERY_DIR);
});

app.delete('/api/delete-file/event-winner/:filename', async (req, res) => {
  deleteFile(req, res, EVENT_WINNERS_DIR);
});

// Helper function to delete files
function deleteFile(req, res, directory) {
  try {
    const filename = req.params.filename;
    const filePath = path.join(directory, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    fs.unlinkSync(filePath);
    console.log('✅ Deleted file:', filename);
    res.json({ success: true, message: 'File deleted', filename: filename });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file', details: error.message });
  }
}

// ============================================
// LIST FILES
// ============================================

app.get('/api/list-files/:type', async (req, res) => {
  try {
    const type = req.params.type;
    let directory;
    
    switch (type) {
      case 'email':
        directory = EMAIL_UPLOADS_DIR;
        break;
      case 'event-banner':
        directory = EVENT_BANNERS_DIR;
        break;
      case 'event-gallery':
        directory = EVENT_GALLERY_DIR;
        break;
      case 'event-winner':
        directory = EVENT_WINNERS_DIR;
        break;
      default:
        return res.status(400).json({ error: 'Invalid file type' });
    }
    
    const files = fs.readdirSync(directory);
    
    const fileDetails = files.map(filename => {
      const filePath = path.join(directory, filename);
      const stats = fs.statSync(filePath);
      
      return {
        filename: filename,
        size: stats.size,
        createdTime: stats.birthtime,
        modifiedTime: stats.mtime,
        url: `http://localhost:${PORT}/api/files/${type}/${filename}`
      };
    });
    
    res.json({
      files: fileDetails,
      count: fileDetails.length,
      directory: directory
    });
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ error: 'Failed to list files', details: error.message });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large', details: err.message });
    }
    return res.status(400).json({ error: 'Upload error', details: err.message });
  }
  
  res.status(500).json({ error: 'Server error', details: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║   🚀 Upload Server Running                 ║');
  console.log('╠════════════════════════════════════════════╣');
  console.log(`║   Port: ${PORT}                               ║`);
  console.log(`║   URL: http://localhost:${PORT}             ║`);
  console.log('╠════════════════════════════════════════════╣');
  console.log('║   Upload Directories:                      ║');
  console.log('║   📧 Email Attachments                     ║');
  console.log('║   🎯 Event Banners                         ║');
  console.log('║   🖼️  Event Gallery                         ║');
  console.log('║   🏆 Event Winners                         ║');
  console.log('╚════════════════════════════════════════════╝\n');
  console.log('✓ Ready to accept file uploads!');
  console.log('✓ Files organized by type and event ID\n');
});

console.log('Server script loaded - listening for requests...');