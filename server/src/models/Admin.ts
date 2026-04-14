import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
}, { timestamps: true });

export const Admin = mongoose.model<IAdmin>('Admin', AdminSchema);
