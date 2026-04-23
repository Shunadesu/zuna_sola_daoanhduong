import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISellerSettings extends Document {
  name: string;
  title: string;
  phone: string;
  zalo: string;
  avatar: string;
  description: string;
  intro: string;
}

const SellerSettingsSchema = new Schema({
  name: { type: String, default: '' },
  title: { type: String, default: '' },
  phone: { type: String, default: '' },
  zalo: { type: String, default: '' },
  avatar: { type: String, default: '' },
  description: { type: String, default: '' },
  intro: { type: String, default: '' },
}, { timestamps: true });

export const SellerSettings: Model<ISellerSettings> = mongoose.model<ISellerSettings>('SellerSettings', SellerSettingsSchema);
export default SellerSettings;
