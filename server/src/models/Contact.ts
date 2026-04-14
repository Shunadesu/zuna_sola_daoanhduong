import mongoose, { Schema, Document } from 'mongoose';

export type ContactType = 'phone' | 'whatsapp' | 'zalo' | 'facebook' | 'quote';

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
    enum: ['phone', 'whatsapp', 'zalo', 'facebook', 'quote'], 
    required: true 
  },
  label: { type: String, required: true },
  value: { type: String, required: true },
  icon: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

ContactSchema.index({ isActive: 1, sortOrder: 1 });

export const Contact = mongoose.model<IContact>('Contact', ContactSchema);
