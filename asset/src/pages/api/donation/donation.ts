// src/pages/api/donation/donation.ts

import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/types/db";
import Donation, { DonationDocument } from "@/models/Donate"; // You can export type DonationDocument from your model
import mongoose from "mongoose";

// Custom error type
type ErrorResponse = {
  error: string;
  details?: string;
  errors?: Record<string, unknown>;
};

type DonationUpdatePayload = Partial<{
  email: string;
  name: string;
  transactionId: string;
  selectedTransactionId: string;
  currency: string;
  donationAmount: number;
}>;

// --- Helper Functions ---

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectDB();
    if (mongoose.connection.readyState !== 1) {
      throw new Error("Database connection not established");
    }
    const donations = await Donation.find({}).lean();
    return res.status(200).json(donations);
  } catch (error) {
    const err = error as Error;
    console.error("GET error:", err);
    return res.status(500).json({
      error: "Failed to fetch donations",
      details: err.message,
    });
  }
}

async function handlePost(
  req: NextApiRequest,
  res: NextApiResponse<DonationDocument | ErrorResponse>
) {
  try {
    await connectDB();
    if (mongoose.connection.readyState !== 1) {
      throw new Error("Database connection not established");
    }

    const {
      email,
      currency,
      transactionId,
      name,
      donationAmount,
      selectedTransactionId,
    } = req.body;

    if (
      !email ||
      !currency ||
      !transactionId ||
      !name ||
      donationAmount == null
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const amount = parseFloat(donationAmount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid donation amount" });
    }

    const newDonation = new Donation({
      email,
      currency,
      transactionId,
      selectedTransactionId: selectedTransactionId || transactionId,
      name,
      donationAmount: amount,
    });

    await newDonation.save();
    return res.status(201).json(newDonation);
  } catch (error) {
    const err = error as mongoose.Error.ValidationError;
    console.error("POST error:", err);
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        error: "Validation failed",
        details: err.message,
        errors: err.errors,
      });
    }
    return res.status(500).json({
      error: "Failed to create donation",
    });
  }
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectDB();
    if (mongoose.connection.readyState !== 1) {
      throw new Error("Database connection not established");
    }

    const {
      id,
      email,
      name,
      transactionId,
      selectedTransactionId,
      currency,
      donationAmount,
    } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Valid Donation ID is required" });
    }

    const updateData: DonationUpdatePayload = {
      email,
      name,
      transactionId,
      selectedTransactionId,
      currency,
    };

    if (donationAmount != null) {
      const amount = parseFloat(donationAmount);
      if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: "Invalid donation amount" });
      }
      updateData.donationAmount = amount;
    }

    Object.keys(updateData).forEach(
      (key) =>
        (updateData as Record<string, unknown>)[key] === undefined &&
        delete (updateData as Record<string, unknown>)[key]
    );

    const updatedDonation = await Donation.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedDonation) {
      return res.status(404).json({ error: "Donation not found" });
    }

    return res.status(200).json(updatedDonation);
  } catch (error) {
    const err = error as mongoose.Error.ValidationError;
    console.error("PUT error:", err);
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        error: "Validation failed",
        details: err.message,
        errors: err.errors,
      });
    }
    return res.status(500).json({
      error: "Failed to update donation",
    });
  }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectDB();
    if (mongoose.connection.readyState !== 1) {
      throw new Error("Database connection not established");
    }

    const { id } = req.query;

    if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ error: "Valid Donation ID is required as a query parameter" });
    }

    const deletedDonation = await Donation.findByIdAndDelete(id);

    if (!deletedDonation) {
      return res.status(404).json({ error: "Donation not found" });
    }

    return res.status(200).json({ message: "Donation deleted successfully" });
  } catch (error) {
    const err = error as Error;
    console.error("DELETE error:", err);
    return res.status(500).json({
      error: "Failed to delete donation",
      details: err.message,
    });
  }
}

// --- API Handler ---

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      await handleGet(req, res);
      break;
    case "POST":
      await handlePost(req, res);
      break;
    case "PUT":
      await handlePut(req, res);
      break;
    case "DELETE":
      await handleDelete(req, res);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
