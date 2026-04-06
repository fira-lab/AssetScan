"use client";

import React, { useState } from "react";
import { Button, Card, CardHeader, Input, useToast } from "@chakra-ui/react";
import { CardContent, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow, parseISO } from "date-fns";

// ────────────────────────────────────────────────
// Interfaces (unchanged)
// ────────────────────────────────────────────────
interface Contact {
  _id: string;
  name: string;
  email: string;
  serial?: string;
  phone?: string;
  location?: string;
  message: string;
  imageUrl?: string;
  subscribe?: boolean;
}

interface HistoryEntry {
  timestamp: string;
  action: string;
  status: string;
  performedBy: string;
  notes?: string;
}

interface UserRecord {
  _id: string;
  email: string;
  status: string;
  history: HistoryEntry[];
}

export default function GateKeeperPage() {
  const [scanInput, setScanInput] = useState("");
  const [contact, setContact] = useState<Contact | null>(null);
  const [userRecord, setUserRecord] = useState<UserRecord | null>(null);
  const [direction, setDirection] = useState<"Entering the gate" | "Exiting the gate">("Entering the gate");
  const [loading, setLoading] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const toast = useToast();

  // ─── VERIFY / SCAN ───────────────────────────────────────
  const handleVerify = async () => {
    const trimmed = scanInput.trim();
    if (!trimmed) {
      toast({ title: "Input required", description: "Enter serial or owner ID", status: "warning" });
      return;
    }

    setLoading(true);
    setContact(null);
    setUserRecord(null);

    try {
      const contactRes = await fetch("/api/contact/contact");
      if (!contactRes.ok) throw new Error("Failed to fetch contacts");
      const allContacts: Contact[] = await contactRes.json();

      const foundContact = allContacts.find(
        (c) =>
          c.serial?.toLowerCase() === trimmed.toLowerCase() ||
          c.email?.toLowerCase() === trimmed.toLowerCase()
      );

      const usersRes = await fetch("/api/users/users");
      if (!usersRes.ok) throw new Error("Failed to fetch user records");
      const allUsers: UserRecord[] = await usersRes.json();

      const foundUser = allUsers.find(
        (u) => u.email?.toLowerCase() === (foundContact?.email || trimmed).toLowerCase()
      );

      if (foundContact) {
        setContact(foundContact);
        setUserRecord(foundUser || null);
        toast({
          title: "Found ✓",
          description: `${foundContact.name} • ${foundContact.message || "Asset"}`,
          status: "success",
        });
      } else {
        toast({ title: "No matching contact found", status: "error" });
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Error loading data", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  // ─── APPROVE ─────────────────────────────────────────────
  const handleApprove = async () => {
    if (!contact) return;

    const newEntry = {
      timestamp: new Date().toISOString(),
      action: direction,
      status: "Approved",
      performedBy: "Gatekeeper",
      notes: "",
    };

    const identifier = contact.email;

    setLoading(true);

    try {
      let res = await fetch("/api/users/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier,
          $push: { history: newEntry },
          $set: { status: "Active" },
        }),
      });

      if (res.ok) {
        const updatedUsers = await (await fetch("/api/users/users")).json();
        const updated = updatedUsers.find((u: UserRecord) => u.email === identifier);
        setUserRecord(updated || null);

        toast({
          title: "Approved & Logged",
          description: `Recorded at ${new Date().toLocaleTimeString()}`,
          status: "success",
          duration: 6000,
        });
        return;
      }

      if (res.status === 404) {
        const createPayload = {
          name: contact.name,
          email: contact.email,
          phone: contact.phone || "",
          serial: contact.serial || "",
          message: contact.message,
          location: contact.location || "",
          gender: "Other",
          status: "Active",
          address: "",
          history: [newEntry],
        };

        res = await fetch("/api/users/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(createPayload),
        });

        if (res.ok) {
          const newUser = await res.json();
          setUserRecord(newUser);
          toast({
            title: "New record created + approved",
            description: "First movement logged",
            status: "success",
          });
          return;
        }
      }

      throw new Error("Operation failed");
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Failed to record movement",
        description: err.message || "Unknown error",
        status: "error",
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

  // ─── Helper: detailed last movement text ────────────────
  const getLastMovementText = () => {
    if (!userRecord?.history?.length) {
      return "No gate movement recorded yet";
    }

    const last = userRecord.history[userRecord.history.length - 1];
    const timeAgo = formatDistanceToNow(parseISO(last.timestamp), { addSuffix: true });

    const action = last.action.toLowerCase();
    if (action.includes("enter") || action.includes("entering")) {
      return `Last entered the gate: ${timeAgo}`;
    }
    if (action.includes("exit") || action.includes("exiting")) {
      return `Last exited the gate: ${timeAgo}`;
    }

    // fallback for any other action type
    return `Last movement (${last.action}): ${timeAgo}`;
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
            Verify → Approve/Deny → Track history
          </p>
        </CardHeader>

        <CardContent className="space-y-10">
          {/* SCAN INPUT */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
            <Input
              placeholder="Scan or enter Serial No / Owner ID (SN 09824 | NSR/868/14)"
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

          {/* RESULT AREA */}
          {contact && (
            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-gray-950 p-6 md:p-10 shadow-lg max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row gap-10 items-start">
                {contact.imageUrl && (
                  <img
                    src={contact.imageUrl}
                    alt={contact.name}
                    className="w-56 h-56 object-cover rounded-2xl border-4 border-emerald-500 shadow-xl flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/224?text=No+Photo";
                    }}
                  />
                )}

                <div className="flex-1 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-4xl font-bold">{contact.name}</h2>
                    {userRecord && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setHistoryOpen(true)}
                        className="border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                      >
                        📜 View History
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-base">
                    <div><strong>Owner ID:</strong> {contact.email}</div>
                    <div><strong>Phone:</strong> {contact.phone || "—"}</div>
                    <div><strong>Asset:</strong> {contact.message || "—"}</div>
                    <div><strong>Serial:</strong> {contact.serial || "—"}</div>
                    <div className="col-span-full"><strong>Department:</strong> {contact.location || "—"}</div>
                  </div>

                  {userRecord && (
                    <div className="pt-4 border-t">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {getLastMovementText()}
                      </p>
                    </div>
                  )}

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

      {/* HISTORY MODAL – unchanged */}
      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="max-w-3xl bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle>
              Gate History — {contact?.name} ({contact?.email})
            </DialogTitle>
          </DialogHeader>

          {userRecord?.history?.length ? (
            <div className="max-h-80 overflow-y-auto mt-4 rounded border">
              <Table>
                <TableHeader className="bg-gray-100 dark:bg-gray-800 sticky top-0">
                  <TableRow>
                    <TableHead>When</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>By</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...userRecord.history]
                    .reverse()
                    .map((entry, i) => (
                      <TableRow key={i}>
                        <TableCell className="whitespace-nowrap font-medium">
                          {formatDistanceToNow(parseISO(entry.timestamp), { addSuffix: true })}
                        </TableCell>
                        <TableCell>{entry.action}</TableCell>
                        <TableCell>{entry.status}</TableCell>
                        <TableCell>{entry.performedBy}</TableCell>
                        <TableCell className="text-gray-500 dark:text-gray-400">
                          {entry.notes || "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500 dark:text-gray-400">
              No gate movements recorded yet.
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setHistoryOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}