"use server";
import type { NextApiRequest, NextApiResponse } from "next";

import Mission from "@/models/Mission";
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
    // GET: Fetch all published Missions
    case "GET":
      try {
        const Missions = await Mission.find({}).lean();
        res.status(200).json(Missions);
      } catch (error) {
        console.log(error);
        res.status(500).json({
          error: "Failed to fetch Missions",
        });
      }
      break;

    // POST: Create a new Mission
    case "POST":
      try {
        const newMission = new Mission({
          title: body.title,
          description: body.description,
          date: body.date,
          location: body.location,
          contactNumber: body.contactNumber,
          mapLink: body.mapLink,
          status: body.status || "Draft",
          language: body.language || "English",
          gallery: body.gallery,
          audio: body.audio,
        });
        await newMission.save();
        res.status(200).json(newMission);
      } catch (error) {
        console.log(error);
        res.status(500).json({
          error: "Failed to create Mission",
        });
        console.error("Create error:", error);
      }
      break;

    // PUT: Update an existing Mission
    case "PUT":
      try {
        const {
          id,
          title,
          description,
          date,
          location,
          contactNumber,
          mapLink,
          status,
          language,
          gallery,
          audio,
        } = body;
        const updatedMission = await Mission.findByIdAndUpdate(
          id,
          {
            title,
            description,
            date,
            location,
            contactNumber,
            mapLink,
            status,
            language,
            gallery,
            audio,
          },
          { new: true, runValidators: true }
        );
        if (!updatedMission) {
          res.status(404).json({ error: "Mission not found" });
          return;
        }
        res.status(200).json(updatedMission);
      } catch (error) {
        console.log(error);
        res.status(500).json({
          error: "Failed to update Mission",
        });
      }
      break;

    // DELETE: Delete an Mission
    case "DELETE":
      try {
        const { id } = query;
        const deletedMission = await Mission.findByIdAndDelete(id);
        if (!deletedMission) {
          res.status(404).json({ error: "Mission not found" });
          return;
        }
        res.status(200).json({ message: "Mission deleted" });
      } catch (error) {
        console.log(error);
        res.status(500).json({
          error: "Failed to delete Mission",
        });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
