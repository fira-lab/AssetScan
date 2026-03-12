import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  image: string;
  name: string;
  category: string;
  price: number;
  sold: number;
  profit: number;
}

const productSchema: Schema = new Schema({
  image: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  sold: { type: Number, required: true },
  profit: { type: Number, required: true },
});

const Product =
  mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);

export default Product;
