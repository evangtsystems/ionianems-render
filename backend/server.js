import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import categoryRoutes from "./routes/categoryRoutes.js";


// ✅ Load environment variables early
dotenv.config();

console.log("🌍 CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("🔑 CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY ? "Loaded" : "Not Found");
console.log("🔒 CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "Loaded" : "Not Found");


// ✅ Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log("✅ MONGO_URI:", process.env.MONGO_URI);

const port = process.env.PORT || 5000;
connectDB();

const app = express();

// ----- ✅ CORS Configuration -----
const allowedOrigins = [
  'https://www.ionianems.com',
  'https://ionianems-frontend.onrender.com',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Allow requests with no origin (like Postman)
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);


app.options('*', cors());
// ----- ✅ CORS Configuration End -----

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ API Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use("/api/categories", categoryRoutes);

// ✅ PayPal Config Route
app.get('/api/config/paypal', (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

// ✅ Serve Uploads Folder (Fix for Missing Images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// ✅ Root API Response
app.get('/', (req, res) => {
  res.send('API is running....');
});

app.use(notFound);
app.use(errorHandler);

// ✅ Start Server
app.listen(port, () =>
  console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);
