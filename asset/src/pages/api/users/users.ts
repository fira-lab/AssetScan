// Removed "use server"; directive - it's not applicable for /pages/api routes
import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/types/db"; // Ensure this path is correct
import User from "@/models/User";    // Ensure this path is correct
// import { Document } from 'mongoose'; // You might need this for proper User type if using Mongoose

// Define types for request body and response for clarity
interface UserRequestBody {
  name: string;
  email: string;
  phone?: string;
  role?: string;
  status?: string;
  // Add other properties that a new user might have
}

interface UserUpdateBody {
  id?: string;
  identifier?: string; // Using email as identifier
  // Any field from UserRequestBody can be here for update
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  status?: string;
  // If you allow $push to history, specify that structure too
  $push?: {
    history?: any; // Define a proper type for history items if possible
  };
  // Other MongoDB update operators like $set, etc.
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body, query } = req;

  try {
    await connectDB();
  } catch (dbError) { // Changed 'error' to 'dbError' to avoid conflict and be more specific
    console.error("DB Connection Error:", dbError);
    return res.status(500).json({ error: "Failed to connect to database" });
  }

  switch (method) {
    // ─── GET all ────────────────────────────────────────
    case "GET":
      try {
        const users = await User.find().sort({ createdAt: -1 });
        return res.status(200).json(users);
      } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ error: "Failed to fetch users" });
      }

    // ─── POST new user ──────────────────────────────────
    case "POST":
      try {
        // Explicitly cast req.body to UserRequestBody
        const newUserBody: UserRequestBody = body; 
        const newUser = new User(newUserBody);
        await newUser.save();
        return res.status(201).json(newUser);
      } catch (error: any) { // Kept 'any' here as Mongoose validation errors can be complex
        console.error("Error creating user:", error);
        return res.status(400).json({ error: error.message || "Failed to create user" });
      }

    // ─── PUT (update) – now supports $push to history ───
    case "PUT":
      try {
        // Explicitly cast req.body to UserUpdateBody
        const { id, identifier, ...updateFields }: UserUpdateBody = body; 

        // Allow lookup by _id OR by email (owner ID)
        let findQuery: { _id?: string; email?: string; }; // Explicitly type findQuery
        if (id) {
          findQuery = { _id: id };
        } else if (identifier) {
          findQuery = { email: identifier };   // using email as owner ID
        } else {
          return res.status(400).json({ error: "Missing id or identifier (email)" });
        }

        const updatedUser = await User.findOneAndUpdate(
          findQuery,
          updateFields,                       // can contain $push, $set, etc.
          { new: true, runValidators: true }
        );

        if (!updatedUser) {
          return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json(updatedUser);
      } catch (error: any) { // Kept 'any' here as Mongoose validation/update errors can be complex
        console.error("Error updating user:", error);
        return res.status(400).json({ error: error.message || "Failed to update user" });
      }

    // ─── DELETE ─────────────────────────────────────────
    case "DELETE":
      try {
        // Query parameters are typically strings, but Mongoose will convert _id
        const { id } = query;
        if (!id || typeof id !== 'string') return res.status(400).json({ error: "id is required and must be a string" });

        const deleted = await User.findByIdAndDelete(id);
        if (!deleted) {
          return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json({ message: "User deleted", id });
      } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ error: "Failed to delete user" });
      }

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}