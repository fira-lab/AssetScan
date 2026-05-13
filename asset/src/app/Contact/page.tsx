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
  const [isFaceScanning, setIsFaceScanning] = useState(false);
  const [faceModelsLoaded, setFaceModelsLoaded] = useState(false);
  const [faceMatchResult, setFaceMatchResult] = useState<{ isMatch: boolean; confidence: number } | null>(null);
  const toast = useToast();

  // ─── FACE RECOGNITION SETUP ───────────────────────────────
  const [faceapi, setFaceapi] = useState<typeof import('face-api.js') | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Load face-api.js dynamically
useEffect(() => {
  const loadFaceAPI = async () => {
    try {
      toast({ 
        title: "Loading Face Recognition", 
        description: "Loading AI models...", 
        status: "info",
        duration: 2000
      });
      
      const faceapiModule = await import('face-api.js');
      setFaceapi(faceapiModule);
      
      // Load models with progress tracking
      await faceapiModule.nets.ssdMobilenetv1.loadFromUri('/model');
      await faceapiModule.nets.faceLandmark68Net.loadFromUri('/model');
      await faceapiModule.nets.faceRecognitionNet.loadFromUri('/model');
      
      setFaceModelsLoaded(true);
      console.log('✅ Models loaded successfully');
      
      toast({ 
        title: "Face Recognition Ready", 
        description: "Models loaded successfully. You can now use face verification.",
        status: "success",
        duration: 3000
      });
      
    } catch (error) {
      console.error('Failed to load face models:', error);
      toast({ 
        title: "Face Recognition Failed", 
        description: "Could not load AI models. Please refresh the page.",
        status: "error",
        duration: 5000
      });
    }
  };
  
  loadFaceAPI();
  
  return () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };
}, [toast]);

  // Start webcam for face scanning
  const startWebcam = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Webcam error:', error);
      toast({ title: "Cannot access webcam", status: "error" });
    }
  };

  // Stop webcam
  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Compare face from URL image with live webcam
  const compareFaceWithContact = async (contactImageUrl: string) => {
    if (!faceapi || !faceModelsLoaded) {
      toast({ title: "Face models not loaded yet", status: "warning" });
      return false;
    }

    if (!videoRef.current || !stream) {
      toast({ title: "Webcam not active", status: "warning" });
      return false;
    }

    try {
      // Get face from live webcam
      const liveDetection = await faceapi
        .detectSingleFace(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!liveDetection) {
        toast({ title: "No face detected in webcam", status: "warning" });
        return false;
      }

      // Get face from contact image URL
      const img = await faceapi.fetchImage(contactImageUrl);
      const urlDetection = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!urlDetection) {
        toast({ title: "No face detected in contact image", status: "warning" });
        return false;
      }

      // Calculate distance (lower = more similar)
      const distance = faceapi.euclideanDistance(
        liveDetection.descriptor,
        urlDetection.descriptor
      );
      
      // Distance < 0.6 means same person (0 = identical, 1+ = different)
      const isMatch = distance < 0.6;
      const confidence = Math.max(0, Math.min(100, (1 - distance) * 100));
      
      setFaceMatchResult({ isMatch, confidence });
      
      return isMatch;
      
    } catch (error) {
      console.error('Face comparison error:', error);
      toast({ title: "Face comparison failed", status: "error" });
      return false;
    }
  };

  // Handle Face Scan button click
  const handleFaceScan = async () => {
    if (!contact) {
      toast({ title: "Please verify a contact first", status: "warning" });
      return;
    }

    if (!contact.imageUrl) {
      toast({ title: "This contact has no profile image", status: "error" });
      return;
    }

    if (!faceModelsLoaded) {
      toast({ title: "Loading face models, please wait...", status: "info" });
      return;
    }

    setIsFaceScanning(true);
    setFaceMatchResult(null);
    await startWebcam();
  };

  // Perform face comparison after webcam is ready
  const performFaceMatch = async () => {
    if (!contact || !contact.imageUrl) return;
    
    const isMatch = await compareFaceWithContact(contact.imageUrl);
    
    if (isMatch) {
      toast({ 
        title: "✅ Face Verified!", 
        description: `Identity confirmed for ${contact.name}`,
        status: "success",
        duration: 5000
      });
      // Auto-approve if face matches
      handleApprove();
    } else {
      toast({ 
        title: "❌ Face Mismatch", 
        description: "Face doesn't match the registered profile image",
        status: "error",
        duration: 5000
      });
    }
    
    // Close dialog after 2 seconds
    setTimeout(() => {
      setIsFaceScanning(false);
      stopWebcam();
    }, 2000);
  };

  // Auto-run comparison when webcam starts
  useEffect(() => {
    if (isFaceScanning && stream && faceModelsLoaded && contact) {
      // Give webcam a moment to initialize
      const timer = setTimeout(() => {
        performFaceMatch();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isFaceScanning, stream, faceModelsLoaded, contact]);

  // ─── VERIFY / SCAN ────────────────────────────────────────
  const handleVerify = useCallback(async (forcedValue?: string) => {
    const rawInput = (forcedValue || scanInput).trim();
    let searchTerm = rawInput;

    try {
      if (rawInput.startsWith('{')) {
        const parsed = JSON.parse(rawInput);
        searchTerm = parsed.serial?.trim() || parsed.email?.trim() || rawInput;
      }
    } catch {
      searchTerm = rawInput;
    }

    if (!searchTerm) {
      toast({ title: "Input required", status: "warning" });
      return;
    }

    setLoading(true);
    setContact(null);
    setUserRecord(null);
    setFaceMatchResult(null);

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
          () => { /* error ignored */ }
        );
      }, 300);

      return () => {
        clearTimeout(timeoutId);
        if (scanner) {
          scanner.clear().catch(err => console.error("Cleanup failed", err));
        }
      };
    }
  }, [isScanning, handleVerify]);

  // ─── APPROVE ─────────────────────────────────────────────
  const handleApprove = async () => {
    if (!contact) return;
    const newEntry: HistoryEntry = {
      timestamp: new Date().toISOString(),
      action: direction,
      status: "Approved",
      performedBy: "Gatekeeper",
      notes: faceMatchResult ? "Face verified" : "Manual approval",
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

                  {/* FACE RECOGNITION BUTTON - NEW */}
                  <Button
                    onClick={handleFaceScan}
                    disabled={!contact.imageUrl || !faceModelsLoaded}
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  >
                    🧑‍🦱 Face Recognition Verification
                  </Button>
                  {faceModelsLoaded === false && (
                    <p className="text-xs text-gray-500 text-center">Loading face models...</p>
                  )}
                  {faceMatchResult && !isFaceScanning && (
                    <p className={`text-sm text-center font-semibold ${faceMatchResult.isMatch ? 'text-green-600' : 'text-red-600'}`}>
                      {faceMatchResult.isMatch 
                        ? `✅ Face Match (${faceMatchResult.confidence.toFixed(1)}% confidence)` 
                        : `❌ Face Mismatch (${faceMatchResult.confidence.toFixed(1)}% confidence)`}
                    </p>
                  )}

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

      {/* FACE SCAN MODAL */}
      <Dialog open={isFaceScanning} onOpenChange={(open) => {
        if (!open) {
          setIsFaceScanning(false);
          stopWebcam();
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Face Recognition Verification</DialogTitle>
          </DialogHeader>
          <div className="p-4 space-y-4">
            <div className="relative bg-black rounded-xl overflow-hidden aspect-video">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
              {!stream && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
                  Starting camera...
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 text-center">
              Looking at {contact?.name}&apos;s registered photo...
            </p>
            <p className="text-xs text-gray-500 text-center">
              Please look directly at the camera
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => {
              setIsFaceScanning(false);
              stopWebcam();
            }}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

      {/* HISTORY MODAL */}
      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="max-w-3xl">
           <DialogHeader><DialogTitle>Gate History — {contact?.name}</DialogTitle></DialogHeader>
           <div className="max-h-80 overflow-y-auto">
             <Table>
               <TableHeader><TableRow><TableHead>When</TableHead><TableHead>Action</TableHead><TableHead>Status</TableHead><TableHead>Notes</TableHead></TableRow></TableHeader>
               <TableBody>
                 {userRecord?.history?.map((h, i) => (
                   <TableRow key={i}>
                     <TableCell>{formatDistanceToNow(parseISO(h.timestamp), { addSuffix: true })}</TableCell>
                     <TableCell>{h.action}</TableCell>
                     <TableCell>{h.status}</TableCell>
                     <TableCell>{h.notes || '-'}</TableCell>
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