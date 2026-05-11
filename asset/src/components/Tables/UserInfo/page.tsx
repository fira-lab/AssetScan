"use client";

import React, { useState } from "react";
import Image from "next/image"; // Import Next.js Image
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { useToast } from "@chakra-ui/react";

// ────────────────────────────────────────────────
// Interface matching your Contact documents
// ────────────────────────────────────────────────
interface Contact {
  _id: string;
  name: string;
  email: string;       // Owner ID e.g. "NSR/868/14"
  serial: string;
  phone: string;
  location: string;
  message: string;     // Asset type/description
  imageUrl: string;
  subscribe?: boolean;
}

export default function GateKeeperPage() {
  const [scanInput, setScanInput] = useState("");
  const [contact, setContact] = useState<Contact | null>(null);
  const [direction, setDirection] = useState<"Entering the gate" | "Exiting the gate">("Entering the gate");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // ─── VERIFY / SCAN ───────────────────────────────────────
  const handleVerify = async () => {
    if (!scanInput.trim()) {
      toast({ title: "Input required", description: "Enter serial or owner ID", status: "warning" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contact/contact");
      if (!res.ok) throw new Error("Failed to fetch contacts");

      const allContacts: Contact[] = await res.json();

      const found = allContacts.find(
        (c) =>
          c.serial?.toLowerCase() === scanInput.trim().toLowerCase() ||
          c.email?.toLowerCase() === scanInput.trim().toLowerCase()
      );

      if (found) {
        setContact(found);
        toast({
          title: "Found ✓",
          description: `${found.name} • ${found.message || "Asset"}`,
          status: "success",
        });
      } else {
        setContact(null);
        toast({ title: "No match found", status: "error" });
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Could not load contacts", status: "error" });
    }
    setLoading(false);
  };

  // ─── APPROVE – Update or Create in /api/users/users ──────
  const handleApprove = async () => {
    if (!contact) return;

    const newEntry = {
      timestamp: new Date().toISOString(),
      action: direction,
      status: "Approved",
      performedBy: "Gatekeeper",
    };

    const identifier = contact.email;

    setLoading(true);

    try {
      let response = await fetch("/api/users/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier,
          $push: { history: newEntry },
        }),
      });

      if (response.ok) {
        toast({
          title: "Approved & Logged",
          description: `Movement recorded at ${new Date().toLocaleTimeString()}`,
          status: "success",
          duration: 6000,
        });
        return;
      }

      if (response.status === 404) {
        const createPayload = {
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          serial: contact.serial,
          message: contact.message,
          location: contact.location,
          gender: "Other",
          status: "Active",
          address: "",
          history: [newEntry],
        };

        response = await fetch("/api/users/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(createPayload),
        });

        if (response.ok) {
          toast({
            title: "New Record Created + Approved",
            description: `First gate movement logged`,
            status: "success",
            duration: 6000,
          });
          return;
        }
      }

      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    } catch (err) {
      // FIX: Check if err is an instance of Error to avoid 'any'
      const errorMessage = err instanceof Error ? err.message : "Could not save gate log";
      console.error("Approve error:", err);
      toast({
        title: "Write failed",
        description: errorMessage,
        status: "error",
        duration: 7000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeny = () => {
    toast({
      title: "❌ ACCESS DENIED",
      description: "Ownership not verified — passage not allowed.",
      status: "error",
      duration: 7000,
    });
  };

  return (
    <Card className="relative overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-none shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />

      <div className="relative z-10 p-6 md:p-8">
        <CardHeader className="pb-8">
          <CardTitle className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
            🛡️ Gate Keeper – Asset Control
          </CardTitle>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Read from contacts • Track movements in users collection
          </p>
        </CardHeader>

        <CardContent className="space-y-10">
          <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
            <Input
              placeholder="Scan or enter Serial No / Owner ID (e.g. SN 09824 | NSR/868/14)"
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && handleVerify()}
              className="h-12 text-lg"
              disabled={loading}
            />
            <Button
              onClick={handleVerify}
              disabled={loading}
              className="h-12 px-10 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-semibold min-w-[140px]"
            >
              {loading ? "Checking..." : "🔍 Verify"}
            </Button>
          </div>

          {contact && (
            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-gray-950 p-6 md:p-10 shadow-lg max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row gap-10 items-start">
                {contact.imageUrl && (
                  <div className="relative w-56 h-56 flex-shrink-0">
                    <Image
                      src={contact.imageUrl}
                      alt={contact.name}
                      fill
                      className="object-cover rounded-2xl border-4 border-emerald-500 shadow-xl"
                      unoptimized // Use this if your images are from an external source like a blob/placeholder
                    />
                  </div>
                )}

                <div className="flex-1 space-y-6">
                  <h2 className="text-4xl font-bold">{contact.name}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-base">
                    <div><strong>Owner ID:</strong> {contact.email}</div>
                    <div><strong>Phone:</strong> {contact.phone}</div>
                    <div><strong>Asset:</strong> {contact.message || "—"}</div>
                    <div><strong>Serial:</strong> {contact.serial || "—"}</div>
                    <div className="col-span-full"><strong>Location:</strong> {contact.location || "—"}</div>
                  </div>

                  <div className="mt-8">
                    <label className="block text-base font-medium mb-3">Gate Direction</label>
                    <Select
                      value={direction}
                      onValueChange={(v: "Entering the gate" | "Exiting the gate") => setDirection(v)}
                      disabled={loading}
                    >
                      <SelectTrigger className="h-12 text-lg">
                        <SelectValue placeholder="Select direction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Entering the gate">Entering the gate (IN)</SelectItem>
                        <SelectItem value="Exiting the gate">Exiting the gate (OUT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="mt-10 flex flex-col sm:flex-row gap-6">
                    <Button
                      onClick={handleApprove}
                      disabled={loading}
                      className="flex-1 h-16 text-xl font-bold bg-emerald-600 hover:bg-emerald-700"
                    >
                      {loading ? "Processing..." : "✅ APPROVE " + direction.toUpperCase()}
                    </Button>
                    <Button
                      onClick={handleDeny}
                      variant="destructive"
                      disabled={loading}
                      className="flex-1 h-16 text-xl font-bold"
                    >
                      ❌ DENY ACCESS
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!contact && scanInput && !loading && (
            <div className="text-center py-16 text-gray-500 dark:text-gray-400 text-lg">
              No matching record found in contacts.
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
}