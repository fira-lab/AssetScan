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
    await connectDB(); // Ensure DB connection
  } catch (error) {
    console.error("DB Connection Error:", error);
    return res.status(500).json({ error: "Failed to connect to database" });
  }

  switch (method) {
    // GET: Fetch all users
    case "GET":
      try {
        const users = await User.find();
        res.status(200).json(users);
      } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
      }
      break;

    // POST: Create a new user
    case "POST":
      try {
        const { name, email, phone, gender, status, address } = body;
        const newUser = new User({ name, email, phone, gender, status, address });
        await newUser.save();
        res.status(200).json(newUser);
      } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Failed to create user" });
      }
      break;

    // PUT: Update an existing user
    case "PUT":
      try {
        const { id, name, email, phone, gender, status, address } = body;
        const updatedUser = await User.findByIdAndUpdate(
          id,
          { name, email, phone, gender, status, address },
          { new: true, runValidators: true }
        );
        if (!updatedUser) {
          return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(updatedUser);
      } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Failed to update user" });
      }
      break;

    // DELETE: Delete a user
    case "DELETE":
      try {
        const { id } = query;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
          return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User deleted" });
      } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Failed to delete user" });
      }
      break;

    // Unsupported Method
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
