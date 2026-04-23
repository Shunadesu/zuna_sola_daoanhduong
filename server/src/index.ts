import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.config.js';
import { 
  authRoutes, 
  bannerRoutes, 
  quoteRoutes, 
  contactRoutes,
  statsRoutes,
  trackRoutes,
  bannerAdminRoutes,
  contactAdminRoutes,
  quoteAdminRoutes,
  overviewAdminRoutes,
  overviewRoutes,
  amenityRoutes,
  amenityAdminRoutes,
  galleryRoutes,
  galleryAdminRoutes,
  perspectiveRoutes,
  perspectiveAdminRoutes,
  telegramAdminRoutes,
  sellerSettingsAdminRoutes,
  sellerRoutes
} from './routes/index.js';
import uploadRoutes from './routes/upload.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4844;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Middleware
app.use(helmet());
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public Routes
app.use('/api/auth', authRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/overviews', overviewRoutes);
app.use('/api/amenities', amenityRoutes);
app.use('/api/galleries', galleryRoutes);
app.use('/api/perspectives', perspectiveRoutes);
app.use('/api/seller', sellerRoutes);

// Track page views (from frontend client)
app.use('/api/track', trackRoutes);

// Admin Routes (protected)
app.use('/api/admin/banners', bannerAdminRoutes);
app.use('/api/admin/quotes', quoteAdminRoutes);
app.use('/api/admin/contacts', contactAdminRoutes);
app.use('/api/admin/overviews', overviewAdminRoutes);
app.use('/api/admin/amenities', amenityAdminRoutes);
app.use('/api/admin/galleries', galleryAdminRoutes);
app.use('/api/admin/perspectives', perspectiveAdminRoutes);
app.use('/api/admin/stats', statsRoutes);
app.use('/api/admin/telegram', telegramAdminRoutes);
app.use('/api/admin/seller-settings', sellerSettingsAdminRoutes);

// Upload Routes
app.use('/api', uploadRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
