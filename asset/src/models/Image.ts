import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema(
  {
    userId: { type: String, required: false, index: false },
    userEmail: { type: String, required: false, index: false },
    userName: String,
    name: {
      type: String,
      default: "CarsAds"  // Default value is the string "CarsAds"
    },
    ImageUrl: String,
  },
  { timestamps: true }
);

const Image = mongoose.models.Image || mongoose.model("Image", ImageSchema);
export default Image;