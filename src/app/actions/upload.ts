'use server';

import { v2 as cloudinary } from 'cloudinary';

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
    const file = formData.get('file') as File;
    if (!file) return { success: false, error: 'No file provided' };

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
