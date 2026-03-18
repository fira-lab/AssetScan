import mongoose, { Schema, Document } from "mongoose";

export interface IMovementHistory extends Document {
  asset: mongoose.Schema.Types.ObjectId;      // Which asset was moved?
  user: mongoose.Schema.Types.ObjectId;       // Who took it? (The owner/borrower)
  gateKeeper: mongoose.Schema.Types.ObjectId; // Which Gate Keeper approved it?
  movementType: "Exit" | "Entry";             // Was it leaving or returning?
  timestamp: Date;                            // When did this happen?
}

const movementHistorySchema: Schema = new Schema({
  // Link to the specific Asset that was moved
  asset: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Asset', 
    required: true 
  },
  
  // Link to the User who is taking the asset
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  // Link to the Gate Keeper User who authorized the movement
  gateKeeper: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  movementType: {
    type: String,
    required: true,
    enum: ["Exit", "Entry"], // The two possible actions
  },

  timestamp: {
    type: Date,
    default: Date.now, // Automatically records the time of the event
  },
});

const MovementHistory = mongoose.models.MovementHistory || mongoose.model<IMovementHistory>("MovementHistory", movementHistorySchema);

export default MovementHistory;