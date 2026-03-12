import mongoose, { Schema, Document } from "mongoose";

export interface AnnouncmentType extends Document {
  Description: string;
  date: Date;
  location: string;
  contactNumber: string;
  status: string;
  mapLink: string;
  language: string;
}

const AnnouncmentSchema: Schema = new Schema({
  Description: {
    type: String,
    required: [true, "Description is required"],
    minlength: [5, "Description must be at least 5 characters"],
  },
  date: {
    type: Date,
    required: [true, "Date is required"],
  },
  location: {
    type: String,
    required: [true, "Location is required"],
  },
  mapLink: {
    type: String,
    required: [true, "Map link is required"],
  },

  contactNumber: {
    type: String,
    required: [true, "Contact number is required"],
    match: [
      /^\+?\d{10,15}$/,
      "Contact number must be 10-15 digits, optionally starting with +",
    ],
  },
  status: {
    type: String,
    enum: ["Draft", "Published", "Archived"],
    default: "Draft",
  },
  language: {
    type: String,
    default: "English",
  },
});

export default mongoose.models.Announcment ||
  mongoose.model<AnnouncmentType>("Announcment", AnnouncmentSchema);
