import mongoose, { Schema, Document, Model } from 'mongoose';

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

export const Admin: Model<IAdmin> = mongoose.model<IAdmin>('Admin', AdminSchema);
export type { IAdmin };
export default Admin;
