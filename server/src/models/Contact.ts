import mongoose, { Schema, Document, Model } from 'mongoose';

type ContactType = 'phone' | 'whatsapp' | 'zalo' | 'facebook' | 'email' | 'address' | 'quote';

export interface IContact extends Document {
  type: ContactType;
  label: string;
  value: string;
  icon?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema({
  type: { 
    type: String, 
    enum: ['phone', 'whatsapp', 'zalo', 'facebook', 'email', 'address', 'quote'], 
    required: true 
  },
  label: { type: String, required: true },
  value: { type: String, required: true },
  icon: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

ContactSchema.index({ isActive: 1, sortOrder: 1 });

export const Contact: Model<IContact> = mongoose.model<IContact>('Contact', ContactSchema);
export type { IContact };
export type { ContactType };
export default Contact;
