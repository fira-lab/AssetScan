import mongoose, { Schema, Document } from "mongoose";

export interface SubscribeType extends Document {
  email: string;
}
const subscribeSchema: Schema = new Schema({
  email: { type: String, required: true },
});

const Subscribe =
  mongoose.models.Subscribe ||
  mongoose.model<SubscribeType>("Subscribe", subscribeSchema);

export default Subscribe;
