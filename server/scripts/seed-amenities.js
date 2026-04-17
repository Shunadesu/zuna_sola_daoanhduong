import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Amenity } from '../src/models/Amenity.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sola';

const amenities = [
  {
    name: 'Công viên Stella',
    images: [],
    description: 'Không gian xanh mát với hồ cảnh quan và vườn hoa tự nhiên',
    isActive: true,
    sortOrder: 1,
  },
  {
    name: 'Công viên Horizon',
    images: [],
    description: 'Khu vực giải trí ngoài trời với sân chơi và đường dạo',
    isActive: true,
    sortOrder: 2,
  },
  {
    name: 'Công viên Fountain',
    images: [],
    description: 'Công viên với đài phun nước nghệ thuật trung tâm',
    isActive: true,
    sortOrder: 3,
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await Amenity.deleteMany({});
    console.log('Cleared existing amenities');

    await Amenity.insertMany(amenities);
    console.log(`Created ${amenities.length} amenities`);

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
