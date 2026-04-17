import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAmenity extends Document {
  name: string;
  images: {
    imageUrl: string;
    sortOrder: number;
  }[];
  description: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const AmenitySchema = new Schema({
  name: { type: String, required: true },
  images: [{
    imageUrl: { type: String, required: true },
    sortOrder: { type: Number, default: 0 },
  }],
  description: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

AmenitySchema.index({ isActive: 1, sortOrder: 1 });

export const Amenity: Model<IAmenity> = mongoose.model<IAmenity>('Amenity', AmenitySchema);
export default Amenity;
