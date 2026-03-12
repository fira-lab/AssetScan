import mongoose, { Schema, Document } from "mongoose";

export interface IOverview extends Document {
  views: { value: number; change: number };
  profit: { value: number; change: number };
  products: { value: number; change: number };
  users: { value: number; change: number };
}

const overviewSchema: Schema = new Schema({
  views: {
    value: { type: Number, required: true },
    change: { type: Number, required: true },
  },
  profit: {
    value: { type: Number, required: true },
    change: { type: Number, required: true },
  },
  products: {
    value: { type: Number, required: true },
    change: { type: Number, required: true },
  },
  users: {
    value: { type: Number, required: true },
    change: { type: Number, required: true },
  },
});

const Overview =
  mongoose.models.Overview ||
  mongoose.model<IOverview>("Overview", overviewSchema);

export default Overview;
