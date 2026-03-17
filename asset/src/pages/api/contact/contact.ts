"use server";
import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/types/db";
import Contact from "@/models/Contact";

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
    // GET: Fetch all contacts
    case "GET":
      try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
      } catch (error) {
        console.log(error);
        res.status(500).json({
          error: "Failed to fetch contacts",
        });
      }
      break;

    // POST: Create a new contact
    case "POST":
      try {
        const newContact = new Contact({
          name: body.name,
          email: body.email,
          location: body.location,
          phone: body.phone,
          message: body.message,
          serial: body.serial,
          subscribe: body.subscribe,
        });
        await newContact.save();
        res.status(200).json(newContact);
      } catch (error) {
        console.error("Error creating contact:", error);
        res.status(500).json({
          error: "Failed to create contact",
        });
      }
      break;

    // PUT: Update an existing contact
    case "PUT":
      try {
        const { id, name, email, location, message,serial, phone, subscribe } = body;
        const updatedContact = await Contact.findByIdAndUpdate(
          id,
          {
            name,
            email,
            location,
            message,
            serial,
            phone,
            subscribe,
          },
          { new: true, runValidators: true }
        );
        if (!updatedContact) {
          res.status(404).json({ error: "Contact not found" });
          return;
        }
        res.status(200).json(updatedContact);
      } catch (error) {
        console.log(error);
        res.status(500).json({
          error: "Failed to update contact",
        });
      }
      break;

    // DELETE: Delete a contact
    case "DELETE":
      try {
        const { id } = query;
        const deletedContact = await Contact.findByIdAndDelete(id);
        if (!deletedContact) {
          res.status(404).json({ error: "Contact not found" });
          return;
        }
        res.status(200).json({ message: "Contact deleted" });
      } catch (error) {
        console.log(error);
        res.status(500).json({
          error: "Failed to delete contact",
        });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
