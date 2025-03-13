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



// ✅ Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });
console.log("✅ MONGO_URI:", process.env.MONGO_URI);

const port = process.env.PORT || 5000;
connectDB();

const app = express();

// ----- CORS Configuration Start -----
// Define allowed origins
const allowedOrigins = [
  process.env.FRONTEND_URL, // e.g., "http://localhost:3000"
  process.env.BACKEND_URL   // e.g., "http://localhost:5000"
].filter(Boolean); // Filter out any undefined values

// Set up CORS middleware
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'https://ionianems-frontend.onrender.com'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);


// Handle preflight requests (OPTIONS)
app.options('*', cors());
// ----- CORS Configuration End -----

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users/verify/:token', userRoutes); // Ensure the token is passed correctly
app.use("/api/categories", categoryRoutes);

app.get('/api/config/paypal', (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use('/uploads', express.static('/var/data/uploads'));
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else {
  const __dirname = path.resolve();
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  ;
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () =>
  console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);