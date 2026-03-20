import { Schema, model, models } from "mongoose";

const ContactSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    serial: { type: String },
    phone: { type: String },
    location: { type: String },
    message: { type: String, required: true },
    subscribe: { type: Boolean, default: false },
    imageUrl: { type: String }, // <-- ADD THIS LINE
  },
  { timestamps: true }
);

const Contact = models.Contact || model("Contact", ContactSchema);

export default Contact;