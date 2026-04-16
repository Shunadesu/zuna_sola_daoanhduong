import mongoose, { Schema, Document, Model } from 'mongoose';

type QuoteStatus = 'new' | 'contacted' | 'closed';

export interface IQuote extends Document {
  fullName: string;
  phone: string;
  email?: string;
  apartment?: string;
  message?: string;
  status: QuoteStatus;
  createdAt: Date;
  updatedAt: Date;
}

const QuoteSchema = new Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  apartment: { type: String, default: '' },
  message: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['new', 'contacted', 'closed'], 
    default: 'new' 
  },
}, { timestamps: true });

QuoteSchema.index({ status: 1, createdAt: -1 });

export const Quote: Model<IQuote> = mongoose.model<IQuote>('Quote', QuoteSchema);
export type { IQuote };
export type { QuoteStatus };
export default Quote;
