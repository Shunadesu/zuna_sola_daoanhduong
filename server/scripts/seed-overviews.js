import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sola';

const overviewSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  linkUrl: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

const Overview = mongoose.model('Overview', overviewSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await Overview.deleteMany({});
    console.log('Cleared existing overviews');

    await Overview.create([
      {
        title: 'Tổng thể 1',
        imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80',
        sortOrder: 1,
        isActive: true,
      },
      {
        title: 'Tổng thể 2',
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80',
        sortOrder: 2,
        isActive: true,
      },
    ]);

    console.log('Created sample overviews');
    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seed();
