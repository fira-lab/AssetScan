import mongoose, { Document, Schema } from "mongoose";

export interface DonationDocument extends Document {
  email: string;
  currency: string;
  transactionId: string;
  selectedTransactionId?: string;
  name: string;
  donationAmount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const donationSchema = new Schema<DonationDocument>(
  {
    email: { type: String, required: true },
    currency: { type: String, required: true },
    transactionId: { type: String, required: true },
    selectedTransactionId: { type: String },
    name: { type: String, required: true },
    donationAmount: { type: Number, required: true },
  },
  {
    timestamps: true, // ✅ Adds createdAt and updatedAt
  }
);

export default mongoose.models.Donation ||
  mongoose.model<DonationDocument>("Donation", donationSchema);
