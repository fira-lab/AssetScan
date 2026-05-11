"use client";

import React, { useState, useEffect, ChangeEvent, useCallback } from "react";
import Image from "next/image";
import { QRCodeCanvas } from "qrcode.react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../../ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../ui/pagination";
import { useToast } from "@chakra-ui/react";
import { Card, CardContent } from "../../ui/card";
import { uploadImage } from "@/app/actions/Image";

// ────────────────────────────────────────────────
// Interfaces
// ────────────────────────────────────────────────
interface ContactUser {
  _id: string;
  name: string;
  email: string;
  serial?: string;
  phone?: string;
  location?: string;
  message: string;
  imageUrl?: string;
}

interface HistoryEntry {
  timestamp: string;
  action: string;
  status: string;
  performedBy: string;
  notes?: string;
}

interface UserStatus {
  email: string; // Fixed: Specify string instead of any
  _id: string;
  status: string;
  history: HistoryEntry[];
}

interface ExtendedUser extends ContactUser {
  statusData?: UserStatus;
}

interface FormData {
  name: string;
  email: string;
  serial: string;
  phone: string;
  location: string;
  message: string;
}

interface EditFormData extends FormData {
  _id: string;
  imageUrl?: string;
}

export default function ContactInfo() {
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<ExtendedUser[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [selectedNameForQr, setSelectedNameForQr] = useState("");
  const [selectedUserForHistory, setSelectedUserForHistory] = useState<ExtendedUser | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditFormData | null>(null);
  const [newForm, setNewForm] = useState<FormData>({
    name: "",
    email: "",
    serial: "",
    phone: "",
    location: "",
    message: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const toast = useToast();
  const pageSize = 10;

  // ────────────────────────────────────────────────
  // Load & merge data
  // ────────────────────────────────────────────────
  const fetchAndMerge = useCallback(async () => {
    try {
      const profileRes = await fetch("/api/contact/contact");
      if (!profileRes.ok) throw new Error("profile fetch failed");
      const profiles: ContactUser[] = await profileRes.json();

      const statusRes = await fetch("/api/users/users");
      if (!statusRes.ok) throw new Error("status fetch failed");
      const statusDocs: UserStatus[] = await statusRes.json();

      const statusByEmail = new Map<string, UserStatus>();
      statusDocs.forEach((doc) => {
        const key = doc.email?.toLowerCase()?.trim();
        if (key) statusByEmail.set(key, doc);
      });

      const merged = profiles.map((p) => {
        const emailKey = p.email?.toLowerCase()?.trim();
        return {
          ...p,
          statusData: emailKey ? statusByEmail.get(emailKey) : undefined,
        };
      });

      setUsers(merged);
      setFilteredUsers(merged);
    } catch (err) {
      console.error(err);
      toast({ title: "Data load failed", status: "error" });
    }
  }, [toast]);

  useEffect(() => {
    fetchAndMerge();
  }, [fetchAndMerge]);

  const refresh = () => fetchAndMerge();

  // ────────────────────────────────────────────────
  // Status & movement display helpers
  // ────────────────────────────────────────────────
  const getDisplayedStatus = (user: ExtendedUser) => {
    const st = user.statusData?.status;
    return st || "Unknown";
  };

  const getLastMovementText = (user: ExtendedUser) => {
    const hist = user.statusData?.history;
    if (!hist?.length) return "No record";

    const latest = hist[hist.length - 1];
    const when = formatDistanceToNow(parseISO(latest.timestamp), { addSuffix: true });

    const act = latest.action.toLowerCase();
    if (act.includes("enter") || act.includes("entering")) return `Entered ${when}`;
    if (act.includes("exit") || act.includes("exiting"))   return `Exited ${when}`;
    return `${latest.action} ${when}`;
  };

  // ────────────────────────────────────────────────
  // CRUD
  // ────────────────────────────────────────────────
  const handleAdd = async () => {
    if (!newForm.name || !newForm.email || !newForm.message) {
      toast({ title: "Required fields missing", status: "warning" });
      return;
    }

    setUploading(true);
    try {
      let imgUrl = "";
      if (imageFile) {
        const fd = new FormData();
        fd.append("image", imageFile);
        const up = await uploadImage(fd);
        if (up.success && up.url) imgUrl = up.url;
      }

      const res = await fetch("/api/contact/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newForm, imageUrl: imgUrl }),
      });

      if (!res.ok) throw new Error("Add failed");
      await refresh();
      setIsAddOpen(false);
      setNewForm({ name: "", email: "", serial: "", phone: "", location: "", message: "" });
      setImageFile(null);
      toast({ title: "Added successfully", status: "success" });
    } catch { // Removed (err) entirely to satisfy strict linter
      toast({ title: "Add failed", status: "error" });
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editForm) return;
    setUploading(true);
    try {
      let imgUrl = editForm.imageUrl;
      if (imageFile) {
        const fd = new FormData();
        fd.append("image", imageFile);
        const up = await uploadImage(fd);
        if (up.success && up.url) imgUrl = up.url;
      }

      const res = await fetch("/api/contact/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editForm, id: editForm._id, imageUrl: imgUrl }),
      });

      if (!res.ok) throw new Error("Update failed");
      await refresh();
      setIsEditOpen(false);
      setImageFile(null);
      toast({ title: "Updated successfully", status: "success" });
    } catch { // Removed (err) entirely to satisfy strict linter
      toast({ title: "Update failed", status: "error" });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/contact/contact?id=${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      await refresh();
      setIsDeleteOpen(false);
      toast({ title: "Deleted successfully", status: "success" });
    } catch { // Removed (err) entirely to satisfy strict linter
      toast({ title: "Delete failed", status: "error" });
    }
  };

  // ────────────────────────────────────────────────
  // Helpers
  // ────────────────────────────────────────────────
  const prepareEdit = (u: ExtendedUser): EditFormData => ({
    _id: u._id,
    name: u.name,
    email: u.email,
    serial: u.serial || "",
    phone: u.phone || "",
    location: u.location || "",
    message: u.message,
    imageUrl: u.imageUrl,
  });

  const generateQr = (u: ExtendedUser) => {
    setQrCodeData(JSON.stringify({ id: u._id, serial: u.serial || "" }));
    setSelectedNameForQr(u.name);
    setIsQrOpen(true);
  };

  const downloadQr = () => {
    const canvas = document.getElementById("qr-canvas") as HTMLCanvasElement | null;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `${selectedNameForQr.replace(/\s+/g, "_")}_qr.png`;
    a.click();
  };

  const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase();
    setSearchTerm(val);
    setFilteredUsers(
      users.filter(
        (u) =>
          u.name.toLowerCase().includes(val) ||
          u.email.toLowerCase().includes(val) ||
          u.message.toLowerCase().includes(val)
      )
    );
    setCurrentPage(1);
  };

  const pageCount = Math.ceil(filteredUsers.length / pageSize);
  const currentPageUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    (currentPage) * pageSize
  );

  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-none shadow-xl">
      <CardContent className="pt-6">
        <style jsx>{`
          .scroll-wrapper { overflow-x: auto; width: 100%; }
          .scroll-wrapper table { min-width: 1200px; }
        `}</style>

        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Owners / Assets</h2>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">Add New</Button>
              </DialogTrigger>
              <DialogContent className="bg-white dark:bg-gray-800">
                <DialogHeader><DialogTitle>Add User / Asset</DialogTitle></DialogHeader>
                <form onSubmit={(e) => { e.preventDefault(); handleAdd(); }} className="space-y-4">
                  <Input required placeholder="Name *" value={newForm.name} onChange={e => setNewForm(s => ({ ...s, name: e.target.value }))} />
                  <Input required placeholder="AMU_ID / Email *" value={newForm.email} onChange={e => setNewForm(s => ({ ...s, email: e.target.value }))} />
                  <Input placeholder="Serial" value={newForm.serial} onChange={e => setNewForm(s => ({ ...s, serial: e.target.value }))} />
                  <Input placeholder="Phone" value={newForm.phone} onChange={e => setNewForm(s => ({ ...s, phone: e.target.value }))} />
                  <Input placeholder="Department / Location" value={newForm.location} onChange={e => setNewForm(s => ({ ...s, location: e.target.value }))} />
                  <Input required placeholder="Asset / Message *" value={newForm.message} onChange={e => setNewForm(s => ({ ...s, message: e.target.value }))} />
                  <div>
                    <label className="text-sm text-gray-500">Photo</label>
                    <Input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] ?? null)} />
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={uploading} className="bg-blue-600">
                      {uploading ? "Saving..." : "Save"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Input
              placeholder="Search name, ID, asset..."
              value={searchTerm}
              onChange={onSearch}
              className="w-full sm:w-64"
            />
          </div>
        </div>

        <div className="scroll-wrapper">
          <Table>
            <TableHeader className="bg-gray-100 dark:bg-gray-900">
              <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>AMU_ID</TableHead>
                <TableHead>Serial</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Movement</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPageUsers.map(u => (
                <TableRow key={u._id}>
                  <TableCell>
                    <div className="relative h-10 w-10 rounded-full overflow-hidden border">
                      <Image src={u.imageUrl || "/placeholder.png"} alt="" fill className="object-cover" />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.serial || "—"}</TableCell>
                  <TableCell>{u.message}</TableCell>
                  <TableCell>
                    <span className={
                      ["Active", "Inside"].includes(u.statusData?.status || "")
                        ? "text-green-600 font-semibold"
                        : "text-red-600 font-semibold"
                    }>
                      {getDisplayedStatus(u)}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {getLastMovementText(u)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-center flex-wrap">
                      <Button size="sm" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50" onClick={() => generateQr(u)}>
                        QR
                      </Button>
                      <Button size="sm" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50" onClick={() => { setEditForm(prepareEdit(u)); setIsEditOpen(true); }}>
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => { setSelectedUserForHistory(u); setIsHistoryOpen(true); }}>
                        History
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => { setDeleteId(u._id); setIsDeleteOpen(true); }}>
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {pageCount > 1 && (
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationPrevious
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className={currentPage === 1 ? "opacity-50 pointer-events-none" : ""}
              />
              {Array.from({ length: pageCount }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={currentPage === i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationNext
                onClick={() => setCurrentPage(p => Math.min(pageCount, p + 1))}
                className={currentPage === pageCount ? "opacity-50 pointer-events-none" : ""}
              />
            </PaginationContent>
          </Pagination>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="bg-white dark:bg-gray-800">
            <DialogHeader><DialogTitle>Edit</DialogTitle></DialogHeader>
            {editForm && (
              <form onSubmit={e => { e.preventDefault(); handleUpdate(); }} className="space-y-4">
                <Input required value={editForm.name} onChange={e => setEditForm(s => s ? { ...s, name: e.target.value } : null)} />
                <Input required value={editForm.email} onChange={e => setEditForm(s => s ? { ...s, email: e.target.value } : null)} />
                <Input value={editForm.serial} onChange={e => setEditForm(s => s ? { ...s, serial: e.target.value } : null)} />
                <Input value={editForm.phone} onChange={e => setEditForm(s => s ? { ...s, phone: e.target.value } : null)} />
                <Input value={editForm.location} onChange={e => setEditForm(s => s ? { ...s, location: e.target.value } : null)} />
                <Input required value={editForm.message} onChange={e => setEditForm(s => s ? { ...s, message: e.target.value } : null)} />
                <div>
                  <label className="text-sm text-gray-500">New Photo (optional)</label>
                  <Input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] ?? null)} />
                </div>
                <DialogFooter>
                  <Button variant="outline" type="button" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={uploading} className="bg-blue-600">
                    {uploading ? "Saving..." : "Save Changes"}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirm */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="bg-white dark:bg-gray-800">
            <DialogHeader><DialogTitle>Delete?</DialogTitle></DialogHeader>
            <p className="py-4">This cannot be undone.</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* QR Dialog */}
        <Dialog open={isQrOpen} onOpenChange={setIsQrOpen}>
          <DialogContent className="bg-white dark:bg-gray-800 flex flex-col items-center">
            <DialogHeader><DialogTitle>QR: {selectedNameForQr}</DialogTitle></DialogHeader>
            <div className="p-6 bg-white rounded-xl shadow">
              <QRCodeCanvas id="qr-canvas" value={qrCodeData || ""} size={240} level="H" includeMargin />
            </div>
            <Button className="mt-6 w-full bg-blue-600" onClick={downloadQr}>
              Download PNG
            </Button>
          </DialogContent>
        </Dialog>

        {/* History Dialog */}
        <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
          <DialogContent className="max-w-3xl bg-white dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle>
                Gate History — {selectedUserForHistory?.name} ({selectedUserForHistory?.email})
              </DialogTitle>
            </DialogHeader>

            {selectedUserForHistory?.statusData?.history?.length ? (
              <div className="max-h-96 overflow-y-auto mt-4 rounded border">
                <Table>
                  <TableHeader className="bg-gray-50 dark:bg-gray-900 sticky top-0">
                    <TableRow>
                      <TableHead>When</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>By</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...selectedUserForHistory.statusData.history]
                      .reverse()
                      .map((e, i) => (
                        <TableRow key={i}>
                          <TableCell className="whitespace-nowrap font-medium">
                            {formatDistanceToNow(parseISO(e.timestamp), { addSuffix: true })}
                          </TableCell>
                          <TableCell>{e.action}</TableCell>
                          <TableCell>{e.status}</TableCell>
                          <TableCell>{e.performedBy}</TableCell>
                          <TableCell className="text-muted-foreground">{e.notes || "—"}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                No gate records yet.
              </div>
            )}

            <DialogFooter>
              <Button onClick={() => setIsHistoryOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}