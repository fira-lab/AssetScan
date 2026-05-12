"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button, Card, CardHeader, Input, useToast } from "@chakra-ui/react";
import { CardContent, CardTitle } from "@/components/ui/card";
import { Html5QrcodeScanner } from "html5-qrcode";
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
  const [isScanning, setIsScanning] = useState(false);
  const toast = useToast();

  // ─── VERIFY / SCAN (Wrapped in useCallback to fix dependency error) ────────
  const handleVerify = useCallback(async (forcedValue?: string) => {
    const rawInput = (forcedValue || scanInput).trim();
    let searchTerm = rawInput;

    try {
      if (rawInput.startsWith('{')) {
        const parsed = JSON.parse(rawInput);
        searchTerm = parsed.serial?.trim() || parsed.email?.trim() || rawInput;
      }
    } catch {
      // "e" removed because it was unused
      searchTerm = rawInput;
    }

    if (!searchTerm) {
      toast({ title: "Input required", status: "warning" });
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
        (c) => c.serial?.toLowerCase() === searchTerm.toLowerCase()
      );

      if (foundContact) {
        setContact(foundContact);
        const usersRes = await fetch("/api/users/users");
        if (usersRes.ok) {
          const allUsers: UserRecord[] = await usersRes.json();
          const foundUser = allUsers.find(
            (u) => u.email?.toLowerCase() === foundContact.email?.toLowerCase()
          );
          setUserRecord(foundUser || null);
        }
        toast({ title: "Verified ✓", status: "success" });
      } else {
        toast({ title: "Not Found", status: "error" });
      }
    } catch {
      // "err" removed because it was unused
      toast({ title: "Error loading data", status: "error" });
    } finally {
      setLoading(false);
    }
  }, [scanInput, toast]);

  // ─── QR SCANNER EFFECT ───────────────────────────────────
  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;

    if (isScanning) {
      const timeoutId = setTimeout(() => {
        const element = document.getElementById("qr-reader");
        if (!element) return;

        scanner = new Html5QrcodeScanner(
          "qr-reader",
          { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
          false
        );

        scanner.render(
          (decodedText) => {
            setScanInput(decodedText);
            setIsScanning(false);
            handleVerify(decodedText);
          },
          () => { /* error ignored to fix 'unused' error */ }
        );
      }, 300);

      return () => {
        clearTimeout(timeoutId);
        if (scanner) {
          scanner.clear().catch(err => console.error("Cleanup failed", err));
        }
      };
    }
  }, [isScanning, handleVerify]); // handleVerify added to dependencies safely

  // ─── APPROVE ─────────────────────────────────────────────
  const handleApprove = async () => {
    if (!contact) return;
    const newEntry: HistoryEntry = {
      timestamp: new Date().toISOString(),
      action: direction,
      status: "Approved",
      performedBy: "Gatekeeper",
      notes: "",
    };

    setLoading(true);
    try {
      const res = await fetch("/api/users/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: contact.email,
          $push: { history: newEntry },
          $set: { status: "Active" },
        }),
      });

      if (res.ok) {
        toast({ title: "Approved & Logged", status: "success" });
        // Refresh local user state
        const refresh = await fetch("/api/users/users");
        const data = await refresh.json();
        setUserRecord(data.find((u: UserRecord) => u.email === contact.email));
      }
    } catch {
      toast({ title: "Failed to record", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeny = () => {
    toast({ title: "❌ ACCESS DENIED", status: "error", duration: 7000 });
  };

  const getLastMovementText = () => {
    if (!userRecord?.history?.length) return "No gate movement recorded yet";
    const last = userRecord.history[userRecord.history.length - 1];
    const timeAgo = formatDistanceToNow(parseISO(last.timestamp), { addSuffix: true });
    return `Last ${last.action.toLowerCase()}: ${timeAgo}`;
  };

  return (
    <Card className="relative overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-none shadow-2xl">
      <div className="relative z-10 p-6 md:p-8">
        <CardHeader className="pb-8">
          <CardTitle className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
            🛡️ Gate Keeper – Asset Control
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-10">
          <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Input
                placeholder="Scan or enter Serial No / Owner ID"
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !loading && handleVerify()}
                className="h-12 text-lg pr-14"
                disabled={loading}
              />
              <button
                onClick={() => setIsScanning(true)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-emerald-50 rounded-lg text-emerald-600"
              >
                📷
              </button>
            </div>
            <Button onClick={() => handleVerify()} isLoading={loading} className="h-12 px-10 bg-emerald-600 hover:bg-emerald-700 text-white">
              🔍 Verify
            </Button>
          </div>

          {contact && (
            <div className="rounded-2xl border border-emerald-200 bg-white dark:bg-gray-950 p-6 shadow-lg max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row gap-10">
                {contact.imageUrl && (
                  <div className="relative w-56 h-56">
                    <Image src={contact.imageUrl} alt={contact.name} fill className="object-cover rounded-2xl border-4 border-emerald-500" />
                  </div>
                )}
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-4xl font-bold">{contact.name}</h2>
                    {userRecord && <Button variant="outline" onClick={() => setHistoryOpen(true)}>📜 History</Button>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><strong>Serial:</strong> {contact.serial}</div>
                    <div><strong>Asset:</strong> {contact.message}</div>
                  </div>
                  <p className="text-sm text-gray-500">{getLastMovementText()}</p>
                  
                  <Select 
  value={direction} 
  onValueChange={(v: "Entering the gate" | "Exiting the gate") => setDirection(v)}
>
  <SelectTrigger className="h-12">
    <SelectValue />
  </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Entering the gate">Entering (IN)</SelectItem>
                      <SelectItem value="Exiting the gate">Exiting (OUT)</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex gap-4 mt-6">
                    <Button onClick={handleApprove} flex="1" h="16" colorScheme="emerald" bg="emerald.600">✅ APPROVE</Button>
                    <Button onClick={handleDeny} flex="1" h="16" colorScheme="red">❌ DENY</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </div>

      {/* QR MODAL */}
      <Dialog open={isScanning} onOpenChange={setIsScanning}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Scan QR Code</DialogTitle></DialogHeader>
          <div className="p-4">
            <div id="qr-reader" className="overflow-hidden rounded-xl border-2 border-emerald-500" style={{ minHeight: '300px' }}></div>
          </div>
          <DialogFooter><Button onClick={() => setIsScanning(false)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* HISTORY MODAL (Simplified for brevity) */}
      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="max-w-3xl">
           <DialogHeader><DialogTitle>Gate History — {contact?.name}</DialogTitle></DialogHeader>
           <div className="max-h-80 overflow-y-auto">
             <Table>
               <TableHeader><TableRow><TableHead>When</TableHead><TableHead>Action</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
               <TableBody>
                 {userRecord?.history?.map((h, i) => (
                   <TableRow key={i}>
                     <TableCell>{formatDistanceToNow(parseISO(h.timestamp), { addSuffix: true })}</TableCell>
                     <TableCell>{h.action}</TableCell>
                     <TableCell>{h.status}</TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
           </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}