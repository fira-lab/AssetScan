// models/User.ts
import mongoose from 'mongoose';

const historyEntrySchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  action: {
    type: String,
    enum: ['Entering the gate', 'Exiting the gate'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Approved', 'Denied'],
    required: true,
  },
  // Optional – useful for auditing
  performedBy: {
    type: String,           // e.g. "Gatekeeper-01", "Admin", or user id
    default: 'Gatekeeper',
  },
  notes: {
    type: String,
    default: '',
  },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {                    // This is actually the Owner/ID like "NSR/868/14"
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    default: 'Other',
  },
  status: {
    type: String,
    enum: ['New Soul', 'Repent', 'Promise', 'Active', 'Inactive'],
    default: 'Active',
  },
  address: {
    type: String,
    default: '',
  },

  // NEW: Gate movement history
  history: {
    type: [historyEntrySchema],
    default: [],
  },

  // Optional fields you might want to copy from Contact sometimes
  serial: {
    type: String,
    sparse: true,           // not required, but useful for matching
  },
  message: String,           // asset type
  location: String,

}, {
  timestamps: true,          // createdAt, updatedAt
});

export default mongoose.models.User || mongoose.model('User', userSchema);