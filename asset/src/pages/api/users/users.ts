"use server";
import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/types/db";
import User from "@/models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body, query } = req;

  try {
    await connectDB();
  } catch (error) {
    console.error("DB Connection Error:", error);
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
        const newUser = new User(body);
        await newUser.save();
        return res.status(201).json(newUser);
      } catch (error: any) {
        console.error("Error creating user:", error);
        return res.status(400).json({ error: error.message || "Failed to create user" });
      }

    // ─── PUT (update) – now supports $push to history ───
    case "PUT":
      try {
        const { id, identifier, ...updateFields } = body;

        // Allow lookup by _id OR by email (owner ID)
        let findQuery;
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
      } catch (error: any) {
        console.error("Error updating user:", error);
        return res.status(400).json({ error: error.message || "Failed to update user" });
      }

    // ─── DELETE ─────────────────────────────────────────
    case "DELETE":
      try {
        const { id } = query;
        if (!id) return res.status(400).json({ error: "id is required" });

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