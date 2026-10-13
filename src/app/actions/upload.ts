'use server';

import { v2 as cloudinary } from 'cloudinary';
import { getAdminRole } from './auth';

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8 MB
const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
]);

// Cloudinary automatically picks up CLOUDINARY_URL. 
// If specific variables were set instead, we configure them manually:
if (!process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function uploadImage(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Only authenticated admins may upload to the media account.
    const role = await getAdminRole();
    if (!role) return { success: false, error: 'Unauthorized' };

    const file = formData.get('file') as File;
    if (!file) return { success: false, error: 'No file provided' };

    if (!ALLOWED_TYPES.has(file.type)) {
      return { success: false, error: 'Unsupported file type' };
    }
    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: 'File too large (max 8MB)' };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise<{ success: boolean; url?: string; error?: string }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'asseli-products' },
        (error, result) => {
          if (error) {
            console.error('Cloudinary Error:', error);
            resolve({ success: false, error: error.message });
          } else {
            resolve({ success: true, url: result?.secure_url });
          }
        }
      ).end(buffer);
    });
  } catch (err: any) {
    console.error('Upload catch error:', err);
    return { success: false, error: err.message || 'Server error' };
  }
}
