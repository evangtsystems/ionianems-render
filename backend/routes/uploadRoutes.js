import path from 'path';
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import sharp from 'sharp';

const router = express.Router();
const __dirname = path.resolve();

// Ensure "uploads/" and "our_work/" directories exist
const uploadDir = path.join(__dirname, 'uploads');
const ourWorkDir = path.join(uploadDir, 'our_work');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

if (!fs.existsSync(ourWorkDir)) {
  fs.mkdirSync(ourWorkDir, { recursive: true });
}

// Multer Storage Configuration (Using memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

const processImage = async (fileBuffer, outputPath, format = 'webp') => {
  try {
    const metadata = await sharp(fileBuffer).metadata();
    let { width, height } = metadata;

    console.log(`📏 Original Image Size: ${width}x${height}`);

    // Define new dimensions (Max width: 1024, keeping aspect ratio)
    let newWidth = width > 1024 ? 1024 : width;
    let newHeight = Math.round((height / width) * newWidth);

    // Ensure reasonable minimum dimensions but avoid upscaling
    if (newWidth < 300) newWidth = 300;
    if (newHeight < 214) newHeight = 214;

    console.log(`🔧 Resizing to: ${newWidth}x${newHeight}`);

    // Apply processing
    await sharp(fileBuffer)
      .resize({ width: newWidth, height: newHeight, fit: 'inside' }) // No upscaling
      .sharpen(0.5) // Prevent over-sharpening
      .modulate({ brightness: 1.02, contrast: 1.05 }) // Subtle enhancement
      .toFormat(format, { quality: 90 })
      .toFile(outputPath);

    console.log(`✅ Image processed & saved: ${outputPath}`);
  } catch (error) {
    console.error("🚨 Error processing image:", error);
  }
};

router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded!' });
    }

    const filename = `image-${Date.now()}.webp`;
    const outputPath = path.join(uploadDir, filename);

    await processImage(req.file.buffer, outputPath, 'webp');

    // ✅ Ensure correct backend URL formatting
    const backendURL = process.env.BACKEND_URL?.trim().replace(/\/$/, '') || "https://ionianems-backend.onrender.com";
    const imagePath = `/uploads/${filename}`;
    const fullImageURL = imagePath; // ✅ Return only relative path


    // 🛠️ Log URL to Debug
    console.log("✅ Backend URL:", backendURL);
    console.log("✅ Image Path:", imagePath);
    console.log("✅ Final Image URL:", fullImageURL);

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      filePath: fullImageURL, // ✅ Fixed URL issue
    });
  } catch (error) {
    console.error("🚨 Error Processing Image:", error.message);
    res.status(500).json({ success: false, message: 'Error processing image' });
  }
});
// 🔹 'Our Work' Image Upload Route (Adaptive)
router.post('/our-work', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded!' });
    }

    const filename = `ourwork-${Date.now()}.jpg`;
    const outputPath = path.join(ourWorkDir, filename);

    await processImage(req.file.buffer, outputPath, 'jpeg');

    const backendURL = process.env.BACKEND_URL?.trim().replace(/\/$/, '') || "https://ionianems-backend.onrender.com";
    const imagePath = `/uploads/our_work/${filename}`;
    const fullImageURL = `${backendURL}${imagePath}`;

    res.status(200).json({
      success: true,
      message: 'Our Work image uploaded successfully',
      filePath: fullImageURL,
    });

  } catch (error) {
    console.error("🚨 Error Processing 'Our Work' Image:", error.message);
    res.status(500).json({ success: false, message: 'Error processing image' });
  }
});

// 🔹 Get All Uploaded Images
router.get('/images', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.status(500).json({ error: 'Error reading uploaded images' });

    const imagePaths = files.map(file => `/uploads/${file}`);
    res.json(imagePaths);
  });
});

// 🔹 Get All 'Our Work' Images
router.get('/our-work/images', (req, res) => {
  fs.readdir(ourWorkDir, (err, files) => {
    if (err) return res.status(500).json({ error: 'Error reading our work images' });

    const imagePaths = files.map(file => `/uploads/our_work/${file}`);
    res.json(imagePaths);
  });
});

// 🔹 Bulk Image Upload Route (Adaptive)
router.post('/bulk-upload/:category', upload.array('images', 23), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded!' });
    }

    const category = req.params.category;
    const categoryPath = path.join(uploadDir, "categories", category); // Ensures images go inside /uploads/categories/{category}

    if (!fs.existsSync(categoryPath)) {
      fs.mkdirSync(categoryPath, { recursive: true });
    }

    const uploadedImages = [];
    for (const file of req.files) {
      const filename = `${Date.now()}-${file.originalname.replace(/\s/g, '_')}.webp`;
      const outputPath = path.join(categoryPath, filename);

      await sharp(file.buffer)
        .resize({ width: 1024, withoutEnlargement: true }) // Keep aspect ratio
        .webp({ quality: 90 })
        .toFile(outputPath);

      uploadedImages.push(`/uploads/categories/${category}/${filename}`); // Correct path for frontend
    }

    console.log("✅ Bulk Upload Complete:", uploadedImages);

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      images: uploadedImages,
    });

  } catch (error) {
    console.error("🚨 Bulk Upload Error:", error.message);
    res.status(500).json({ success: false, message: 'Error processing images' });
  }
});

export default router;
