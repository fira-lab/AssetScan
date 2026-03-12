"use server";
import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/types/db";
import Announcment from "@/models/Announcment";

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
    // GET: Fetch all announcements
    case "GET":
      try {
        const announcements = await Announcment.find();
        res.status(200).json(announcements);
      } catch (error) {
        console.log(error);
        res.status(500).json({
          error: "Failed to fetch announcements",
        });
      }
      break;

    // POST: Create a new announcement
    case "POST":
      try {
        const newAnnouncement = new Announcment({
          Description: body.Description,
          date: body.date,
          location: body.location,
          mapLink: body.mapLink,

          contactNumber: body.contactNumber,
          status: body.status || "Draft",
          language: body.language || "English",
        });
        await newAnnouncement.save();
        res.status(200).json(newAnnouncement);
      } catch (error) {
        res.status(500).json({
          error: "Failed to create announcement",
        });
        console.log(error, "this is it");
      }
      break;

    // PUT: Update an existing announcement
    case "PUT":
      try {
        const {
          id,
          Description,
          date,
          location,
          contactNumber,
          mapLink,
          status,
          language,
        } = body;
        const updatedAnnouncement = await Announcment.findByIdAndUpdate(
          id,
          {
            Description,
            date,
            location,
            contactNumber,
            status,
            language,
            mapLink,
          },
          { new: true, runValidators: true }
        );
        if (!updatedAnnouncement) {
          res.status(404).json({ error: "Announcement not found" });
          return;
        }
        res.status(200).json(updatedAnnouncement);
      } catch (error) {
        console.log(error);
        res.status(500).json({
          error: "Failed to update announcement",
        });
      }
      break;

    // DELETE: Delete an announcement
    case "DELETE":
      try {
        const { id } = query;
        const deletedAnnouncement = await Announcment.findByIdAndDelete(id);
        if (!deletedAnnouncement) {
          res.status(404).json({ error: "Announcement not found" });
          return;
        }
        res.status(200).json({ message: "Announcement deleted" });
      } catch (error) {
        console.log(error);
        res.status(500).json({
          error: "Failed to delete announcement",
        });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
