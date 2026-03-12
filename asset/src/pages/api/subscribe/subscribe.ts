"use server";
import type { NextApiRequest, NextApiResponse } from "next";

import Subscribe from "@/models/Subscribe";
import connectDB from "@/types/db";

// Default export function to handle API requests
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body, query } = req;

  try {
    await connectDB(); // Ensure DB connection
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to connect to database" });
  }

  switch (method) {
    // GET: Fetch all published Subscribes
    case "GET":
      try {
        const Subscribes = await Subscribe.find({}).lean();
        res.status(200).json(Subscribes);
      } catch (error) {
        console.log(error);
        res.status(500).json({
          error: "Failed to fetch Subscribes",
        });
      }
      break;

    // POST: Create a new Subscribe
    case "POST":
      try {
        const newSubscribe = new Subscribe({
          email: body.email,
        });
        await newSubscribe.save();
        res.status(200).json(newSubscribe);
      } catch (error) {
        res.status(500).json({
          error: "Failed to create Subscribe",
        });
        console.error("Create error:", error);
      }
      break;

    // PUT: Update an existing Subscribe
    case "PUT":
      try {
        const { email } = body;
        const { id } = query;
        const updatedSubscribe = await Subscribe.findByIdAndUpdate(
          id,
          {
            email,
          },
          { new: true, runValidators: true }
        );
        if (!updatedSubscribe) {
          res.status(404).json({ error: "Subscribe not found" });
          return;
        }
        res.status(200).json(updatedSubscribe);
      } catch (error) {
        console.log(error);
        res.status(500).json({
          error: "Failed to update Subscribe",
        });
      }
      break;

    // DELETE: Delete an Subscribe
    case "DELETE":
      try {
        const { id } = query;
        const deletedSubscribe = await Subscribe.findByIdAndDelete(id);
        if (!deletedSubscribe) {
          res.status(404).json({ error: "Subscribe not found" });
          return;
        }
        res.status(200).json({ message: "Subscribe deleted" });
      } catch (error) {
        console.log(error);
        res.status(500).json({
          error: "Failed to delete Subscribe",
        });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
