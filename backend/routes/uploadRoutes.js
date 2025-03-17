import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import sharp from 'sharp';
import dotenv from 'dotenv';
import '../config/cloudinary.js'; // ✅ Import Cloudinary Config

dotenv.config();

const router = express.Router();

// ✅ Cloudinary Multer Storage Configuration
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'uploads',
    format: async () => 'webp',
    public_id: () => `image-${Date.now()}`,
    transformation: [{ width: 1024, crop: 'limit' }],
  },
});

const upload = multer({ storage });

// ✅ Image Processing Function (Resize + Optimize before uploading to Cloudinary)
const processImage = async (fileBuffer) => {
  try {
    const optimizedImage = await sharp(fileBuffer)
      .resize({ width: 1024, fit: 'inside' }) // Resize max width to 1024px
      .toFormat('webp', { quality: 90 }) // Convert to WebP
      .toBuffer();
    return optimizedImage;
  } catch (error) {
    console.error("🚨 Error processing image:", error);
    throw new Error('Image processing failed');
  }
};

// ✅ Single Image Upload Route
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded!' });
    }

    console.log('✅ Uploaded Image URL:', req.file.path);

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      filePath: req.file.path, // ✅ Cloudinary URL
    });
  } catch (error) {
    console.error("🚨 Error Uploading Image:", error);
    res.status(500).json({ success: false, message: 'Error uploading image' });
  }
});

import { v2 as cloudinary } from 'cloudinary';

// ✅ Upload "Our Work" Images to Cloudinary
router.post('/our-work', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded!' });
    }

    // ✅ Upload to Cloudinary under "uploads/our_work/"
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'uploads/our_work', // ✅ Store in "uploads/our_work/"
      use_filename: true,
      unique_filename: false,
      resource_type: 'image',
    });

    console.log('✅ Our Work Image URL:', result.secure_url);

    res.status(200).json({
      success: true,
      message: 'Our Work image uploaded successfully',
      filePath: result.secure_url, // ✅ Cloudinary URL
    });

  } catch (error) {
    console.error("🚨 Error Uploading 'Our Work' Image:", error);
    res.status(500).json({ success: false, message: 'Error uploading image' });
  }
});


/** ✅ Bulk Image Upload Route (Max 10 Images) **/
router.post('/bulk-upload', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded!' });
    }

    const uploadedImages = await Promise.all(
      req.files.map(async (file) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.v2.uploader.upload_stream(
            { folder: 'uploads' },
            (error, result) => {
              if (error) return reject(error);
              resolve(result.secure_url);
            }
          );
          streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
      })
    );

    console.log('✅ Bulk Upload:', uploadedImages);

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      images: uploadedImages, // ✅ Array of Cloudinary URLs
    });
  } catch (error) {
    console.error("🚨 Error Uploading Images:", error);
    res.status(500).json({ success: false, message: 'Error uploading images' });
  }
});

/** ✅ Get All Uploaded Images (Stored in Cloudinary) **/
router.get('/images', async (req, res) => {
  try {
    const { resources } = await cloudinary.v2.search
      .expression('folder:uploads/')
      .sort_by('created_at', 'desc')
      .max_results(50)
      .execute();

    const imageUrls = resources.map(file => file.secure_url);
    res.json(imageUrls);
  } catch (error) {
    console.error("🚨 Error Fetching Images:", error);
    res.status(500).json({ success: false, message: 'Error fetching images' });
  }
});

/** ✅ Get All 'Our Work' Images **/
// ✅ Get All "Our Work" Images from Cloudinary
router.get('/our-work/images', async (req, res) => {
  try {
    const { resources } = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'uploads/our_work/', // ✅ Fetch from "uploads/our_work/"
      max_results: 50, // Adjust as needed
    });

    if (!resources || resources.length === 0) {
      return res.status(404).json({ success: false, message: 'No images found in our_work folder.' });
    }

    const imageUrls = resources.map(file => file.secure_url);
    res.json(imageUrls);
  } catch (error) {
    console.error("🚨 Error Fetching Our Work Images:", error);
    res.status(500).json({ success: false, message: 'Error fetching images from Cloudinary.' });
  }
});

export default router;