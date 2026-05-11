// pages/api/users/users.ts
import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/types/db"; 
import User from "@/models/User"; 

// 1. Define the History structure
interface HistoryEntry {
  timestamp: string;
  action: string;
  status: string;
  performedBy: string;
}

// 2. Define the body for creating a user
interface UserRequestBody {
  name: string;
  email: string;
  phone?: string;
  role?: string;
  status?: string;
  location?: string;
  message?: string;
  gender?: string;
  address?: string;
  history?: HistoryEntry[];
}

// 3. Define the body for updating a user
interface UserUpdateBody extends Partial<UserRequestBody> {
  id?: string;
  identifier?: string; 
  $push?: {
    history: HistoryEntry;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body, query } = req;

  try {
    await connectDB();
  } catch (dbError) {
    console.error("DB Connection Error:", dbError);
    return res.status(500).json({ error: "Failed to connect to database" });
  }

  switch (method) {
    case "GET":
      try {
        const users = await User.find().sort({ createdAt: -1 });
        return res.status(200).json(users);
      } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ error: "Failed to fetch users" });
      }

    case "POST":
      try {
        const newUserBody: UserRequestBody = body; 
        const newUser = new User(newUserBody);
        await newUser.save();
        return res.status(201).json(newUser);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to create user";
        return res.status(400).json({ error: errorMessage });
      }

    case "PUT":
      try {
        // Destructure id and identifier, collect the rest into updateData
        const { id, identifier, ...updateData } = body as UserUpdateBody; 

        // Build the query
        const findQuery = id ? { _id: id } : identifier ? { email: identifier } : null;

        if (!findQuery) {
          return res.status(400).json({ error: "Missing id or identifier (email)" });
        }

        // Use 'updateData' directly. TypeScript now understands it via UserUpdateBody
        const updatedUser = await User.findOneAndUpdate(
          findQuery,
          updateData, 
          { new: true, runValidators: true }
        );

        if (!updatedUser) {
          return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json(updatedUser);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to update user";
        return res.status(400).json({ error: errorMessage });
      }

    case "DELETE":
      try {
        const { id } = query;
        if (!id || typeof id !== 'string') {
          return res.status(400).json({ error: "id is required" });
        }

        const deleted = await User.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ error: "User not found" });
        
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