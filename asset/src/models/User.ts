import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  gender: string;
  status: string;
  address: string;
}

const userSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
   
  },
  status: {
    type: String,
    required: true,
    enum: ["Owner", "Borrower", "Admin","Gate Keeper"],
  },
  phone: { type: String, required: true },
  gender: { type: String, required: true },
  address: { type: String, required: true },
});

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
