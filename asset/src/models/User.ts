import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  age: number;
  phone: string;
  gender: string;
  status: string;
  address: string;
}

const userSchema: Schema = new Schema({
  name: { type: String, required: true },
  age: {
    type: Number,
    required: false,
    min: [0, "Age cannot be negative"],
    max: [120, "Age cannot exceed 120"],
  },
  status: {
    type: String,
    required: true,
    enum: ["New Soul", "Repent", "Hope"],
  },
  phone: { type: String, required: true },
  gender: { type: String, required: true },
  address: { type: String, required: true },
});

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
