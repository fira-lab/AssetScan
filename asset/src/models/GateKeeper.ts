import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGateKeeper extends Document {
  clerkUserId: string | null;
  email: string;
  name: string;                    // Full name
  firstName?: string;
  lastName?: string;
  message?: string;
  role: 'gatekeeper' | 'admin';
  status: 'invited' | 'active' | 'revoked' | 'deleted';
  invitedAt: Date;
  acceptedAt?: Date;
  lastSignInAt?: Date;
  profileImageUrl?: string;
  phoneNumber?: string;
  notes?: string;
}

const GateKeeperSchema = new Schema<IGateKeeper>(
  {
    clerkUserId: {
      type: String,
      sparse: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['gatekeeper', 'admin'],
      default: 'gatekeeper',
    },
    status: {
      type: String,
      enum: ['invited', 'active', 'revoked', 'deleted'],
      default: 'invited',
    },
    invitedAt: {
      type: Date,
      default: Date.now,
    },
    acceptedAt: {
      type: Date,
    },
    lastSignInAt: {
      type: Date,
    },
    profileImageUrl: {
      type: String,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtuals
GateKeeperSchema.virtual('fullName').get(function () {
  return this.name;
});

// Indexes
GateKeeperSchema.index({ clerkUserId: 1 });
GateKeeperSchema.index({ email: 1 });
GateKeeperSchema.index({ status: 1 });
GateKeeperSchema.index({ role: 1 });

// Pre-save hook to ensure name is set
GateKeeperSchema.pre('save', function (next) {
  if (!this.name && (this.firstName || this.lastName)) {
    this.name = `${this.firstName || ''} ${this.lastName || ''}`.trim();
  }
  next();
});

const GateKeeper: Model<IGateKeeper> = 
  mongoose.models.GateKeeper || mongoose.model<IGateKeeper>('GateKeeper', GateKeeperSchema);

export default GateKeeper;