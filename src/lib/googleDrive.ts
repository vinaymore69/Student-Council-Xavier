import { google } from 'googleapis';
import { Storage } from '@google-cloud/storage';
import path from 'path';

// Initialize Google Drive API
const KEYFILE_PATH = path.join(process.cwd(), 'student-council-website-475620-6f3e802f45e3.json');

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILE_PATH,
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({ version: 'v3', auth });
const storage = new Storage({ keyFilename: KEYFILE_PATH });

// Folder ID where files will be uploaded (create a folder in Drive and get its ID)
const DRIVE_FOLDER_ID = '1Ww_wStv97KLiQ8jlMkDhaLJC2-sLpb4y'; // Replace with actual folder ID

export interface DriveUploadResult {
  fileId: string;
  fileName: string;
  fileUrl: string;
  viewUrl: string;
  mimeType: string;
  size: number;
}

/**
 * Upload file to Google Drive
 */
export async function uploadToDrive(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<DriveUploadResult> {
  try {
    const fileMetadata = {
      name: fileName,
      parents: [DRIVE_FOLDER_ID],
    };

    const media = {
      mimeType: mimeType,
      body: require('stream').Readable.from(fileBuffer),
    };

    const file = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, name, mimeType, size, webViewLink, webContentLink',
    });

    // Make file publicly accessible
    await drive.permissions.create({
      fileId: file.data.id!,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    return {
      fileId: file.data.id!,
      fileName: file.data.name!,
      fileUrl: file.data.webContentLink || '',
      viewUrl: file.data.webViewLink || '',
      mimeType: file.data.mimeType || mimeType,
      size: parseInt(file.data.size || '0'),
    };
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    throw new Error('Failed to upload file to Google Drive');
  }
}

/**
 * Delete file from Google Drive
 */
export async function deleteFromDrive(fileId: string): Promise<void> {
  try {
    await drive.files.delete({
      fileId: fileId,
    });
  } catch (error) {
    console.error('Error deleting from Google Drive:', error);
    throw new Error('Failed to delete file from Google Drive');
  }
}

/**
 * Get file info from Google Drive
 */
export async function getFileInfo(fileId: string) {
  try {
    const file = await drive.files.get({
      fileId: fileId,
      fields: 'id, name, mimeType, size, webViewLink, webContentLink',
    });

    return file.data;
  } catch (error) {
    console.error('Error getting file info:', error);
    throw new Error('Failed to get file info');
  }
}