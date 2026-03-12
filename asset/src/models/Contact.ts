import mongoose, { Schema, Document } from "mongoose";

export interface ContactType extends Document {
  name: string;
  email: string;
  phone: string; // Changed to string to match schema
  location: string;
  message: string;
  subscribe: boolean;
  created_at: Date;
  updated_at: Date;
}

const ContactSchema: Schema = new Schema({
  name: String,
  email: String,
  phone: String,
  location: String,
  message: String,
  subscribe: { type: Boolean, default: false }, // Added subscribe field
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default mongoose.models.Contact ||
  mongoose.model<ContactType>("Contact", ContactSchema);
