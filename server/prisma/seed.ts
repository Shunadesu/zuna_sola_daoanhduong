import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { Admin, Banner, Contact } from '../src/models/index.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sola:sola_sunny@cluster0.vdepymi.mongodb.net/?appName=Cluster0';

const seedAdmin = async () => {
  const existingAdmin = await Admin.findOne({ username: 'admin' });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await Admin.create({
      username: 'admin',
      password: hashedPassword
    });
    console.log('Admin user created: admin / admin123');
  } else {
    console.log('Admin user already exists');
  }
};

const seedSampleData = async () => {
  const bannerCount = await Banner.countDocuments();
  if (bannerCount === 0) {
    await Banner.insertMany([
      {
        title: 'Căn Hộ Cao Cấp Sola Đảo Ảnh Dương',
        subtitle: 'Không gian sống lý tưởng bên bờ biển',
        imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1920',
        linkUrl: '',
        isActive: true,
        sortOrder: 1
      },
      {
        title: 'Mặt Tiền Đường Biển',
        subtitle: 'Tầm view panorama đẹp nhất',
        imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920',
        linkUrl: '',
        isActive: true,
        sortOrder: 2
      },
      {
        title: 'Nội Thất Sang Trọng',
        subtitle: 'Thiết kế hiện đại, tiện nghi đầy đủ',
        imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920',
        linkUrl: '',
        isActive: true,
        sortOrder: 3
      }
    ]);
    console.log('Sample banners created');
  } else {
    console.log('Banners already exist');
  }

  const contactCount = await Contact.countDocuments();
  if (contactCount === 0) {
    await Contact.insertMany([
      {
        type: 'phone',
        label: 'Hotline',
        value: '0909123456',
        isActive: true,
        sortOrder: 1
      },
      {
        type: 'zalo',
        label: 'Zalo',
        value: '0909123456',
        isActive: true,
        sortOrder: 2
      },
      {
        type: 'facebook',
        label: 'Facebook',
        value: 'https://facebook.com/solaapartment',
        isActive: true,
        sortOrder: 3
      },
      {
        type: 'whatsapp',
        label: 'WhatsApp',
        value: '84909123456',
        isActive: true,
        sortOrder: 4
      },
      {
        type: 'quote',
        label: 'Báo giá',
        value: '#quote',
        isActive: true,
        sortOrder: 5
      }
    ]);
    console.log('Sample contacts created');
  } else {
    console.log('Contacts already exist');
  }
};

const seed = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await seedAdmin();
    await seedSampleData();

    console.log('Seed completed!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
