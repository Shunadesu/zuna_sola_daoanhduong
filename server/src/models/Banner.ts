import mongoose, { Schema, Document } from 'mongoose';

export interface IBanner extends Document {
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new Schema({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  imageUrl: { type: String, required: true },
  linkUrl: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

BannerSchema.index({ isActive: 1, sortOrder: 1 });

export const Banner = mongoose.model<IBanner>('Banner', BannerSchema);
