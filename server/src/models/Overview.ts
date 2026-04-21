import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOverview extends Document {
  title: string;
  imageUrl?: string;
  images: {
    imageUrl: string;
    sortOrder: number;
  }[];
  linkUrl?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const OverviewSchema = new Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  images: [{
    imageUrl: { type: String, required: true },
    sortOrder: { type: Number, default: 0 },
  }],
  linkUrl: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

OverviewSchema.index({ isActive: 1, sortOrder: 1 });

export const Overview: Model<IOverview> = mongoose.model<IOverview>('Overview', OverviewSchema);
export default Overview;
