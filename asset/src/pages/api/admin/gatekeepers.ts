// pages/api/admin/gatekeepers.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/types/db";
import GateKeeper from "@/models/GateKeeper";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId: adminUserId } = getAuth(req);

  if (!adminUserId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    await connectDB();

    // ====================== VERIFY ADMIN ======================
    const adminRes = await fetch(`https://api.clerk.dev/v1/users/${adminUserId}`, {
      headers: { Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}` },
    });

    if (!adminRes.ok) return res.status(500).json({ error: "Failed to verify admin" });

    const adminUser = await adminRes.json();

    if (adminUser.public_metadata?.role !== "admin") {
      return res.status(403).json({ error: "Access denied: Admin only" });
    }

    // ====================== GET ======================
    if (req.method === "GET") {
      const usersRes = await fetch("https://api.clerk.dev/v1/users?limit=500", {
        headers: { Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}` },
      });

      if (!usersRes.ok) return res.status(500).json({ error: "Failed to fetch users from Clerk" });

      const allClerkUsers: any[] = await usersRes.json();

      const privilegedUsers = allClerkUsers.filter((u: any) => {
        const role = u.public_metadata?.role;
        return role === "admin" || role === "gatekeeper";
      });

      const dbGateKeepers = await GateKeeper.find().lean();

      const result = privilegedUsers.map((clerkUser: any) => {
        const gatekeeperDoc = dbGateKeepers.find((g: any) => g.clerkUserId === clerkUser.id);
        return {
          id: clerkUser.id,
          email: clerkUser.email_addresses?.[0]?.email_address || "N/A",
          firstName: clerkUser.first_name || "",
          lastName: clerkUser.last_name || "",
          profileImageUrl: clerkUser.profile_image_url || "",
          role: clerkUser.public_metadata?.role || "user",
          createdAt: clerkUser.created_at,
          lastSignInAt: clerkUser.last_sign_in_at,
          dbGateKeeperId: gatekeeperDoc?._id?.toString() || null,
          dbGateKeeperName: gatekeeperDoc?.name || null,
          dbGateKeeperMessage: gatekeeperDoc?.message || null,
        };
      });

      return res.status(200).json(result);
    }

    // ====================== POST: Register New Gatekeeper ======================
    if (req.method === "POST") {
      const { firstName, lastName, email, message } = req.body;

      if (!firstName || !lastName || !email) {
        return res.status(400).json({ error: "First name, last name and email are required" });
      }

      // Create Clerk Invitation
      const inviteRes = await fetch("https://api.clerk.dev/v1/invitations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: email,
          redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/sign-in`,
          public_metadata: { role: "gatekeeper" },
          notify: true,
        }),
      });

      if (!inviteRes.ok) {
        const errorText = await inviteRes.text();
        console.error("Clerk invitation error:", errorText);
        return res.status(500).json({ error: "Failed to send Clerk invitation" });
      }

      const invitation = await inviteRes.json();

      // Always create GateKeeper record (fixed bug)
      await GateKeeper.create({
        clerkUserId: invitation.user_id || null,
        name: `${firstName} ${lastName}`.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        message: message?.trim() || "",
        role: "gatekeeper",
        status: "invited",
      });

      return res.status(201).json({
        success: true,
        message: "Gatekeeper registered successfully. Invitation sent.",
        invitation,
      });
    }

    // ====================== PATCH ======================
    if (req.method === "PATCH") {
      const { userId, newRole } = req.body;

      if (!userId || !newRole) {
        return res.status(400).json({ error: "userId and newRole are required" });
      }

      if (userId === adminUserId && newRole !== "admin") {
        return res.status(403).json({ error: "You cannot change your own admin role" });
      }

      const updateRes = await fetch(`https://api.clerk.dev/v1/users/${userId}/metadata`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ public_metadata: { role: newRole } }),
      });

      if (!updateRes.ok) return res.status(500).json({ error: "Failed to update role in Clerk" });

      return res.status(200).json({ success: true });
    }

    // ====================== DELETE ======================
    if (req.method === "DELETE") {
      const { userId } = req.query;

      if (!userId || typeof userId !== "string") {
        return res.status(400).json({ error: "User ID is required" });
      }

      if (userId === adminUserId) {
        return res.status(403).json({ error: "You cannot delete your own account" });
      }

      const deleteRes = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}` },
      });

      if (!deleteRes.ok) return res.status(500).json({ error: "Failed to delete user from Clerk" });

      // Optional: Delete from local DB
      await GateKeeper.deleteOne({ clerkUserId: userId });

      return res.status(200).json({ success: true });
    }

    res.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });

  } catch (error: any) {
    console.error("Error in /api/admin/gatekeepers:", error);
    return res.status(500).json({ 
      error: "Internal server error",
      details: error.message 
    });
  }
}