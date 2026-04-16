import mongoose from 'mongoose';
import 'dotenv/config';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/zuna_soladaoanhduong';

async function resetVisits() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('visits');
    
    const count = await collection.countDocuments();
    console.log(`Current visits count: ${count}`);

    if (count > 0) {
      await collection.deleteMany({});
      console.log('All visits deleted successfully!');
    } else {
      console.log('Visits collection is already empty.');
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

resetVisits();
