import mongoose, { Schema, Document } from "mongoose";

export interface MissionType extends Document {
  description: string;
  title: string;
  date: Date;
  location: string;
  contactNumber: string;
  status: string;
  mapLink: string;
  language: string;
  gallery: string[];
  audio: string;
}

const MissionSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    minlength: [5, "Title must be at least 5 characters"],
  },
  description: {
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
    required: [false, "Map link is required"],
  },
  contactNumber: {
    type: String,
    required: [true, "Contact number is required"],
    // match: [
    //   /^\+?\d{10,15}$/,
    //   "Contact number must be 10-15 digits, optionally starting with +",
    // ],
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
  gallery: {
    type: [String],
    required: [true, "Gallery images are required"],
    // validate: {
    //   validator: (array) => array.length > 0,
    //   message: "At least one gallery image is required",
    // },
  },
  audio: {
    type: String,
    required: [true, "Audio file is required"],
  },
});

export default mongoose.models.Mission ||
  mongoose.model<MissionType>("Mission", MissionSchema);
