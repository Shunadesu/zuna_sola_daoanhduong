import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGallery extends Document {
  title: string;
  imageUrl: string;
  category: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema = new Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ['biệt thự song lập', 'biệt thự đơn lập', 'nhà phố liền kề'],
    default: 'biệt thự song lập'
  },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

GallerySchema.index({ isActive: 1, sortOrder: 1 });
GallerySchema.index({ category: 1 });

export const Gallery: Model<IGallery> = mongoose.model<IGallery>('Gallery', GallerySchema);
export default Gallery;
