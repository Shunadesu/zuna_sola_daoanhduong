import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVisit extends Document {
  ip: string;
  path: string;
  userAgent?: string;
  referrer?: string;
  createdAt: Date;
}

const VisitSchema = new Schema({
  ip: { type: String, required: true },
  path: { type: String, required: true },
  userAgent: { type: String, default: '' },
  referrer: { type: String, default: '' },
}, { timestamps: true });

VisitSchema.index({ ip: 1, createdAt: -1 });
VisitSchema.index({ createdAt: -1 });

export const Visit: Model<IVisit> = mongoose.model<IVisit>('Visit', VisitSchema);
export default Visit;
